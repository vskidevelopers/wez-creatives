"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateOrderStatusSchema } from "@/lib/validations/order";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();

  const rawData = {
    orderId: formData.get("orderId") as string,
    status: formData.get("status") as string,
  };

  const validated = updateOrderStatusSchema.parse(rawData);

  await db
    .update(orders)
    .set({ orderStatus: validated.status, updatedAt: new Date() })
    .where(eq(orders.id, validated.orderId));

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${validated.orderId}`);

  return { success: true };
}
