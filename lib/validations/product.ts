import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric or hyphens"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  size: z.string().optional(),
  color: z.string().optional(),
  priceOverride: z.coerce.number().int().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric or hyphens"),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  price: z.coerce.number().int().min(0, "Price must be a positive number"),
  categoryId: z.string().nullable().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  variants: z.array(variantSchema).default([]),
});
