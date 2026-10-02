import {
  pgTable,
  text,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { media } from "./media";

export const productMedia = pgTable(
  "product_media",
  {
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.mediaId] }),
  }),
);
