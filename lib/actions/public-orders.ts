"use server";

import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function trackOrderAction(reference: string) {
  try {
    // Normalize reference (trim and uppercase)
    const normalizedRef = reference.trim().toUpperCase();

    if (!normalizedRef) {
      return { success: false, error: "Please enter an order reference" };
    }

    // Fetch order by reference (only safe fields)
    const [order] = await db
      .select({
        id: orders.id,
        reference: orders.reference,
        customerName: orders.customerName,
        fulfillmentType: orders.fulfillmentType,
        orderStatus: orders.orderStatus,
        paymentStatus: orders.paymentStatus,
        paymentPreference: orders.paymentPreference,
        itemsSubtotal: orders.itemsSubtotal,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(eq(orders.reference, normalizedRef))
      .limit(1);

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Fetch order items (only product names and quantities)
    const items = await db
      .select({
        productName: orderItems.productName,
        variantName: orderItems.variantName,
        quantity: orderItems.quantity,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    return {
      success: true,
      order: {
        reference: order.reference,
        customerName: order.customerName,
        fulfillmentType: order.fulfillmentType,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentPreference: order.paymentPreference,
        itemsSubtotal: order.itemsSubtotal,
        createdAt: order.createdAt,
        items,
      },
    };
  } catch (error) {
    console.error("Order tracking error:", error);
    return { success: false, error: "Failed to retrieve order" };
  }
}
