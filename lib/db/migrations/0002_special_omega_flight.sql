CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "service_media" (
	"service_id" text NOT NULL,
	"media_id" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "service_media_service_id_media_id_pk" PRIMARY KEY("service_id","media_id")
);
--> statement-breakpoint
ALTER TABLE "service_media" ADD CONSTRAINT "service_media_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_media" ADD CONSTRAINT "service_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;