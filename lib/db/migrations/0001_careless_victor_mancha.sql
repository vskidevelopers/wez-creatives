CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"secure_url" text NOT NULL,
	"resource_type" text DEFAULT 'image' NOT NULL,
	"format" text NOT NULL,
	"original_filename" text,
	"width" integer,
	"height" integer,
	"bytes" integer,
	"folder" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_cloudinary_public_id_unique" UNIQUE("cloudinary_public_id")
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"short_description" text,
	"full_description" text,
	"price" integer NOT NULL,
	"category_id" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"name" text NOT NULL,
	"size" text,
	"color" text,
	"price_override" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_media" (
	"product_id" text NOT NULL,
	"media_id" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "product_media_product_id_media_id_pk" PRIMARY KEY("product_id","media_id")
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;