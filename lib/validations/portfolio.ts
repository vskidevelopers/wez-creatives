import { z } from "zod";

export const portfolioCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric or hyphens"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const portfolioWorkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric or hyphens"),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  clientEventReference: z.string().optional(),
  projectContext: z.string().optional(),
  projectDate: z.string().optional(),
  isPublished: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});
