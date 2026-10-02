import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { portfolioCategories } from "./portfolio-categories";

export const portfolioWork = pgTable("portfolio_work", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  categoryId: text("category_id").references(() => portfolioCategories.id, {
    onDelete: "set null",
  }),
  clientEventReference: text("client_event_reference"),
  projectContext: text("project_context"),
  projectDate: date("project_date"),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
