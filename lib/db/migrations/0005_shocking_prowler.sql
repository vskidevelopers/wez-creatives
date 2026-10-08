CREATE INDEX "orders_reference_idx" ON "orders" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "orders_customer_name_idx" ON "orders" USING btree ("customer_name");--> statement-breakpoint
CREATE INDEX "orders_customer_phone_idx" ON "orders" USING btree ("customer_phone");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("order_status");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");