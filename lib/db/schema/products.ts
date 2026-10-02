import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { productCategories } from "./product-categories";

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  // Price is stored as an integer representing the exact amount in KES (no cents).
  price: integer("price").notNull(),
  categoryId: text("category_id").references(() => productCategories.id, {
    onDelete: "set null",
  }),
  isPublished: boolean("is_published").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
