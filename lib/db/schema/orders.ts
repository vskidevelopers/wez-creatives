import {
  pgTable,
  text,
  integer,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { productVariants } from "./product-variants";

export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    reference: varchar("reference", { length: 20 }).notNull().unique(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    fulfillmentType: text("fulfillment_type").notNull(),
    deliveryAddress: text("delivery_address"),
    orderNotes: text("order_notes"),
    paymentPreference: text("payment_preference").notNull(),
    orderStatus: text("order_status").notNull().default("received"),
    paymentStatus: text("payment_status").notNull().default("pending"),
    itemsSubtotal: integer("items_subtotal").notNull(),
    deliveryFee: integer("delivery_fee").default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    referenceIdx: index("orders_reference_idx").on(table.reference),
    customerNameIdx: index("orders_customer_name_idx").on(table.customerName),
    customerPhoneIdx: index("orders_customer_phone_idx").on(
      table.customerPhone,
    ),
    orderStatusIdx: index("orders_status_idx").on(table.orderStatus),
    createdAtIdx: index("orders_created_at_idx").on(table.createdAt),
  }),
);

export const orderItems = pgTable("order_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  variantId: text("variant_id").references(() => productVariants.id, {
    onDelete: "set null",
  }),
  productName: text("product_name").notNull(),
  variantName: text("variant_name"),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: integer("line_total").notNull(),
});
