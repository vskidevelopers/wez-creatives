"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  portfolioCategories,
  portfolioWork,
  portfolioWorkMedia,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import {
  portfolioCategorySchema,
  portfolioWorkSchema,
} from "@/lib/validations/portfolio";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
}

// --- Categories ---
export async function savePortfolioCategoryAction(formData: FormData) {
  await requireAdmin();

  const rawData = {
    id: (formData.get("id") as string) || undefined, // Convert empty string to undefined
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    isActive: formData.get("isActive") === "on",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  const validated = portfolioCategorySchema.parse(rawData);

  if (validated.id) {
    const { id, ...updateData } = validated;
    await db
      .update(portfolioCategories)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(portfolioCategories.id, id));
  } else {
    const { id, ...insertData } = validated;
    await db.insert(portfolioCategories).values(insertData);
  }

  revalidatePath("/admin/portfolio/categories");
}

export async function deletePortfolioCategoryAction(categoryId: string) {
  await requireAdmin();
  await db
    .delete(portfolioCategories)
    .where(eq(portfolioCategories.id, categoryId));
  revalidatePath("/admin/portfolio/categories");
}

// --- Work ---
export async function savePortfolioWorkAction(formData: FormData) {
  await requireAdmin();

  const rawData = {
    id: (formData.get("id") as string) || undefined, // Convert empty string to undefined
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    categoryId: (formData.get("categoryId") as string) || null,
    clientEventReference:
      (formData.get("clientEventReference") as string) || null,
    projectContext: (formData.get("projectContext") as string) || null,
    projectDate: (formData.get("projectDate") as string) || null,
    isPublished: formData.get("isPublished") === "on",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  const validated = portfolioWorkSchema.parse(rawData);

  if (validated.id) {
    const { id, ...updateData } = validated;
    await db
      .update(portfolioWork)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(portfolioWork.id, id));
  } else {
    const { id, ...insertData } = validated;
    const [newWork] = await db
      .insert(portfolioWork)
      .values(insertData)
      .returning({ id: portfolioWork.id });
    validated.id = newWork.id;
  }

  revalidatePath("/admin/portfolio");
  revalidatePath(`/admin/portfolio/${validated.id || "new"}`);
}

export async function deletePortfolioWorkAction(workId: string) {
  await requireAdmin();
  await db.delete(portfolioWork).where(eq(portfolioWork.id, workId));
  revalidatePath("/admin/portfolio");
}

// --- Media ---
export async function attachMediaToPortfolioWorkAction(
  workId: string,
  mediaId: string,
) {
  await requireAdmin();

  // Check if the work already has any media attached
  const existingMedia = await db
    .select()
    .from(portfolioWorkMedia)
    .where(eq(portfolioWorkMedia.workId, workId))
    .limit(1);

  const isFirstImage = existingMedia.length === 0;

  // If it's the first image, automatically set it as primary
  await db
    .insert(portfolioWorkMedia)
    .values({
      workId,
      mediaId,
      isPrimary: isFirstImage,
    })
    .onConflictDoNothing();

  revalidatePath(`/admin/portfolio/${workId}`);
}

export async function detachMediaFromPortfolioWorkAction(
  workId: string,
  mediaId: string,
) {
  await requireAdmin();
  await db
    .delete(portfolioWorkMedia)
    .where(
      and(
        eq(portfolioWorkMedia.workId, workId),
        eq(portfolioWorkMedia.mediaId, mediaId),
      ),
    );
  revalidatePath(`/admin/portfolio/${workId}`);
}

export async function setPrimaryPortfolioMediaAction(
  workId: string,
  mediaId: string,
) {
  await requireAdmin();
  await db
    .update(portfolioWorkMedia)
    .set({ isPrimary: false })
    .where(eq(portfolioWorkMedia.workId, workId));
  await db
    .update(portfolioWorkMedia)
    .set({ isPrimary: true })
    .where(
      and(
        eq(portfolioWorkMedia.workId, workId),
        eq(portfolioWorkMedia.mediaId, mediaId),
      ),
    );
  revalidatePath(`/admin/portfolio/${workId}`);
}
