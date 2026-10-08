import { z } from "zod";

export const orderStatusSchema = z.enum([
  "received",
  "confirmed",
  "processing",
  "ready",
  "completed",
  "cancelled",
]);

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: orderStatusSchema,
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
