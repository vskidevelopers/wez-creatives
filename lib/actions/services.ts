"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { services, serviceMedia, media } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { serviceSchema } from "@/lib/validations/service";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
}

export async function saveServiceAction(formData: FormData) {
  await requireAdmin();

  const rawData = {
    id: formData.get("id") as string | undefined,
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string | undefined,
    isPublished: formData.get("isPublished") === "on",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  const validated = serviceSchema.parse(rawData);

  if (validated.id) {
    await db
      .update(services)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(services.id, validated.id));
  } else {
    await db.insert(services).values(validated);
  }

  revalidatePath("/admin/services");
}

export async function deleteServiceAction(serviceId: string) {
  await requireAdmin();
  await db.delete(services).where(eq(services.id, serviceId));
  revalidatePath("/admin/services");
}

export async function attachMediaToServiceAction(
  serviceId: string,
  mediaId: string,
) {
  await requireAdmin();
  await db
    .insert(serviceMedia)
    .values({ serviceId, mediaId })
    .onConflictDoNothing();
  revalidatePath(`/admin/services/${serviceId}`);
}

export async function detachMediaFromServiceAction(
  serviceId: string,
  mediaId: string,
) {
  await requireAdmin();
  await db
    .delete(serviceMedia)
    .where(
      and(
        eq(serviceMedia.serviceId, serviceId),
        eq(serviceMedia.mediaId, mediaId),
      ),
    );
  revalidatePath(`/admin/services/${serviceId}`);
}

export async function setPrimaryServiceMediaAction(
  serviceId: string,
  mediaId: string,
) {
  await requireAdmin();
  // Unset all primary
  await db
    .update(serviceMedia)
    .set({ isPrimary: false })
    .where(eq(serviceMedia.serviceId, serviceId));
  // Set new primary
  await db
    .update(serviceMedia)
    .set({ isPrimary: true })
    .where(
      and(
        eq(serviceMedia.serviceId, serviceId),
        eq(serviceMedia.mediaId, mediaId),
      ),
    );
  revalidatePath(`/admin/services/${serviceId}`);
}
