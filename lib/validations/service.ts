import { z } from "zod";

export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric or hyphens"),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});
