import {
  pgTable,
  text,
  integer,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { media } from "./media";

export const customRequests = pgTable("custom_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  reference: varchar("reference", { length: 20 }).notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull(),
  requestType: text("request_type").notNull(),
  projectDescription: text("project_description").notNull(),
  quantity: integer("quantity"),
  preferredDeadline: text("preferred_deadline"),
  additionalNotes: text("additional_notes"),
  status: text("status").notNull().default("received"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const customRequestArtwork = pgTable("custom_request_artwork", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  requestId: text("request_id")
    .notNull()
    .references(() => customRequests.id, { onDelete: "cascade" }),
  mediaId: text("media_id")
    .notNull()
    .references(() => media.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
