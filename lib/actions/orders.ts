/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";
import { orders, orderItems, products, productVariants } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().positive(),
});

const orderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(1, "Phone is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  fulfillmentType: z.enum(["delivery", "pickup"]),
  deliveryAddress: z.string().optional(),
  orderNotes: z.string().optional(),
  paymentPreference: z.enum(["pay_now", "pay_later"]),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

function generateOrderReference(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `ORD-${year}-${random}`;
}

export async function submitOrderAction(formData: any) {
  try {
    // 1. Validate input
    const validated = orderSchema.parse(formData);

    // 2. Validate delivery address if delivery selected
    if (
      validated.fulfillmentType === "delivery" &&
      !validated.deliveryAddress
    ) {
      return {
        success: false,
        error: "Delivery address is required for delivery orders",
      };
    }

    // 3. Fetch and validate all products/variants from database
    const itemsWithPrices = await Promise.all(
      validated.items.map(async (item) => {
        // Fetch product
        const [product] = await db
          .select()
          .from(products)
          .where(
            and(
              eq(products.id, item.productId),
              eq(products.isPublished, true),
            ),
          )
          .limit(1);

        if (!product) {
          throw new Error(`Product ${item.productId} is not available`);
        }

        let unitPrice = product.price;
        let variantName: string | undefined;

        // Fetch variant if specified
        if (item.variantId) {
          const [variant] = await db
            .select()
            .from(productVariants)
            .where(
              and(
                eq(productVariants.id, item.variantId),
                eq(productVariants.productId, item.productId),
                eq(productVariants.isActive, true),
              ),
            )
            .limit(1);

          if (!variant) {
            throw new Error(`Variant ${item.variantId} is not available`);
          }

          unitPrice = variant.priceOverride ?? product.price;
          variantName = variant.name;
        }

        return {
          productId: item.productId,
          variantId: item.variantId,
          productName: product.name,
          variantName,
          unitPrice,
          quantity: item.quantity,
          lineTotal: unitPrice * item.quantity,
        };
      }),
    );

    // 4. Calculate totals
    const itemsSubtotal = itemsWithPrices.reduce(
      (sum, item) => sum + item.lineTotal,
      0,
    );

    // 5. Generate unique order reference
    let reference = generateOrderReference();
    let attempts = 0;
    while (attempts < 5) {
      const [existing] = await db
        .select()
        .from(orders)
        .where(eq(orders.reference, reference))
        .limit(1);

      if (!existing) break;
      reference = generateOrderReference();
      attempts++;
    }

    // 6. Create order transactionally
    const [order] = await db
      .insert(orders)
      .values({
        reference,
        customerName: validated.customerName,
        customerPhone: validated.customerPhone,
        customerEmail: validated.customerEmail || null,
        fulfillmentType: validated.fulfillmentType,
        deliveryAddress: validated.deliveryAddress || null,
        orderNotes: validated.orderNotes || null,
        paymentPreference: validated.paymentPreference,
        orderStatus: "received",
        paymentStatus: "pending",
        itemsSubtotal,
        deliveryFee: 0,
      })
      .returning();

    // 7. Create order items
    await db.insert(orderItems).values(
      itemsWithPrices.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId || null,
        productName: item.productName,
        variantName: item.variantName || null,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
    );

    return { success: true, reference: order.reference };
  } catch (error) {
    console.error("Order submission error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid order data" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}
