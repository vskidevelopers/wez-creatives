import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const services = pgTable("services", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
