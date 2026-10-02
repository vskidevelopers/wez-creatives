import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { products } from "./products";

export const productVariants = pgTable("product_variants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "Small / Black"
  size: text("size"),
  color: text("color"),
  priceOverride: integer("price_override"), // Optional override in KES
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
