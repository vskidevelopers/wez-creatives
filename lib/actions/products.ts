"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  products,
  productVariants,
  productMedia,
  media,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { productSchema } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const variantIds = formData.getAll("variantIds") as string[];
  const variantNames = formData.getAll("variantNames") as string[];
  const variantSizes = formData.getAll("variantSizes") as string[];
  const variantColors = formData.getAll("variantColors") as string[];
  const variantPrices = formData.getAll("variantPrices") as string[];

  const variants = variantIds.map((_, i) => ({
    id: variantIds[i] || undefined,
    name: variantNames[i],
    size: variantSizes[i],
    color: variantColors[i],
    priceOverride: variantPrices[i] ? parseInt(variantPrices[i]) : null,
  }));

  const rawData = {
    id: (formData.get("id") as string) || undefined,
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    shortDescription: (formData.get("shortDescription") as string) || null,
    fullDescription: (formData.get("fullDescription") as string) || null,
    price: parseInt(formData.get("price") as string),
    categoryId: (formData.get("categoryId") as string) || null,
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    variants,
  };

  const validated = productSchema.parse(rawData);
  const { variants: parsedVariants, ...productData } = validated;

  let productId = validated.id;

  if (productId) {
    await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, productId));
    await db
      .delete(productVariants)
      .where(eq(productVariants.productId, productId));
  } else {
    const [newProduct] = await db
      .insert(products)
      .values(productData)
      .returning({ id: products.id });
    productId = newProduct.id;
  }

  if (parsedVariants.length > 0) {
    await db
      .insert(productVariants)
      .values(parsedVariants.map((v) => ({ ...v, productId: productId! })));
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  return productId;
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  await db.delete(products).where(eq(products.id, productId));
  revalidatePath("/admin/products");
}

export async function attachMediaToProductAction(
  productId: string,
  mediaId: string,
) {
  await requireAdmin();

  // Check if the product already has any media attached
  const existingMedia = await db
    .select()
    .from(productMedia)
    .where(eq(productMedia.productId, productId))
    .limit(1);

  const isFirstImage = existingMedia.length === 0;

  // If it's the first image, automatically set it as primary
  await db
    .insert(productMedia)
    .values({
      productId,
      mediaId,
      isPrimary: isFirstImage,
    })
    .onConflictDoNothing();

  revalidatePath(`/admin/products/${productId}`);
}

export async function detachMediaFromProductAction(
  productId: string,
  mediaId: string,
) {
  await requireAdmin();
  await db
    .delete(productMedia)
    .where(
      and(
        eq(productMedia.productId, productId),
        eq(productMedia.mediaId, mediaId),
      ),
    );
  revalidatePath(`/admin/products/${productId}`);
}

export async function setPrimaryMediaAction(
  productId: string,
  mediaId: string,
) {
  await requireAdmin();
  await db
    .update(productMedia)
    .set({ isPrimary: false })
    .where(eq(productMedia.productId, productId));
  await db
    .update(productMedia)
    .set({ isPrimary: true })
    .where(
      and(
        eq(productMedia.productId, productId),
        eq(productMedia.mediaId, mediaId),
      ),
    );
  revalidatePath(`/admin/products/${productId}`);
}
