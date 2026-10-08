CREATE TABLE "custom_request_artwork" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"media_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" varchar(20) NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text NOT NULL,
	"request_type" text NOT NULL,
	"project_description" text NOT NULL,
	"quantity" integer,
	"preferred_deadline" text,
	"additional_notes" text,
	"status" text DEFAULT 'received' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "custom_requests_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "custom_request_artwork" ADD CONSTRAINT "custom_request_artwork_request_id_custom_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."custom_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_request_artwork" ADD CONSTRAINT "custom_request_artwork_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;