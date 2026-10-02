import {
  pgTable,
  text,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { portfolioWork } from "./portfolio-work";
import { media } from "./media";

export const portfolioWorkMedia = pgTable(
  "portfolio_work_media",
  {
    workId: text("work_id")
      .notNull()
      .references(() => portfolioWork.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.workId, table.mediaId] }),
  }),
);
