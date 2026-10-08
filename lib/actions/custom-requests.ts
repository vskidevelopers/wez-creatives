/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";
import {
  customRequests,
  customRequestArtwork,
} from "@/lib/db/schema/custom-requests";
import { eq } from "drizzle-orm";
import { customRequestSchema } from "@/lib/validations/custom-request";

function generateRequestReference(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `REQ-${year}-${random}`;
}

export async function submitCustomRequestAction(formData: any) {
  try {
    // Validate input
    const validated = customRequestSchema.parse(formData);

    // Generate unique reference
    let reference = generateRequestReference();
    let attempts = 0;
    while (attempts < 5) {
      const [existing] = await db
        .select()
        .from(customRequests)
        .where(eq(customRequests.reference, reference))
        .limit(1);

      if (!existing) break;
      reference = generateRequestReference();
      attempts++;
    }

    // Create custom request
    const [request] = await db
      .insert(customRequests)
      .values({
        reference,
        customerName: validated.customerName,
        customerPhone: validated.customerPhone,
        customerEmail: validated.customerEmail,
        requestType: validated.requestType,
        projectDescription: validated.projectDescription,
        quantity: validated.quantity || null,
        preferredDeadline: validated.preferredDeadline || null,
        additionalNotes: validated.additionalNotes || null,
        status: "received",
      })
      .returning();

    // Associate artwork if provided
    if (validated.artworkIds && validated.artworkIds.length > 0) {
      await db.insert(customRequestArtwork).values(
        validated.artworkIds.map((mediaId: string) => ({
          requestId: request.id,
          mediaId,
        })),
      );
    }

    return { success: true, reference: request.reference };
  } catch (error) {
    console.error("Custom request submission error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to submit request" };
  }
}
