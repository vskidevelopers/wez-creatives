"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { productCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { categorySchema } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();

  const rawData = {
    id: formData.get("id") as string | undefined,
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string | undefined,
    isActive: formData.get("isActive") === "on",
  };

  const validated = categorySchema.parse(rawData);

  if (validated.id) {
    await db
      .update(productCategories)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(productCategories.id, validated.id));
  } else {
    await db.insert(productCategories).values(validated);
  }

  revalidatePath("/admin/products/categories");
}

export async function deleteCategoryAction(categoryId: string) {
  await requireAdmin();
  // Set null on products referencing this category to preserve referential integrity
  await db
    .delete(productCategories)
    .where(eq(productCategories.id, categoryId));
  revalidatePath("/admin/products/categories");
}
