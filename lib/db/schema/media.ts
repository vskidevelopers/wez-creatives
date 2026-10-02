import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Media table stores metadata and references to Cloudinary assets.
 * It is intentionally decoupled from business entities (Products, Portfolio, etc.)
 * which will reference this table via foreign keys in future phases.
 */
export const media = pgTable("media", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(),
  secureUrl: text("secure_url").notNull(),
  resourceType: text("resource_type").notNull().default("image"),
  format: text("format").notNull(),
  originalFilename: text("original_filename"),
  width: integer("width"),
  height: integer("height"),
  bytes: integer("bytes"),
  folder: text("folder"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
