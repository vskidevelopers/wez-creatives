import { z } from "zod";

export const customRequestSchema = z.object({
  customerName: z.string().min(1, "Full name is required").max(200),
  customerPhone: z.string().min(1, "Phone number is required").max(20),
  customerEmail: z.string().email("Invalid email address").max(200),
  requestType: z.enum([
    "branding",
    "printing",
    "graphic-design",
    "branded-merchandise",
    "apparel-branding",
    "event-promotional",
    "custom-bulk",
    "other",
  ]),
  projectDescription: z
    .string()
    .min(10, "Please provide more details (at least 10 characters)")
    .max(5000),
  quantity: z.coerce
    .number()
    .int()
    .positive("Quantity must be a positive number")
    .optional()
    .nullable(),
  preferredDeadline: z.string().optional().nullable(),
  additionalNotes: z.string().max(2000).optional().nullable(),
  artworkIds: z.array(z.string()).optional().default([]),
});

export type CustomRequestInput = z.infer<typeof customRequestSchema>;
