import {
  pgTable,
  text,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { services } from "./services";
import { media } from "./media";

export const serviceMedia = pgTable(
  "service_media",
  {
    serviceId: text("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.serviceId, table.mediaId] }),
  }),
);
