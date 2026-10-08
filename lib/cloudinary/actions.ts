/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema/media";
import { eq } from "drizzle-orm";

/**
 * Server-side primitive to upload a file to Cloudinary and persist its metadata.
 * Protected: Requires an active admin session.
 */
export async function uploadMediaAction(file: File, folder: string) {
  // FORCE CONFIGURATION HERE to bypass Next.js module caching quirks with Server Actions
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error(
      "Unauthorized: Admin access required for media operations.",
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `wez-creatives/${folder}`, // Enforces predictable namespace
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(buffer);
  });

  const [newMedia] = await db
    .insert(media)
    .values({
      cloudinaryPublicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      resourceType: uploadResult.resource_type,
      format: uploadResult.format,
      originalFilename: uploadResult.original_filename,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      folder: uploadResult.folder,
    })
    .returning();

  return newMedia;
}

/**
 * Server-side primitive to soft-delete a media record and remove it from Cloudinary.
 * Protected: Requires an active admin session.
 */
export async function deleteMediaAction(mediaId: string) {
  // FORCE CONFIGURATION HERE as well for consistency
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error(
      "Unauthorized: Admin access required for media operations.",
    );
  }

  const [mediaRecord] = await db
    .select()
    .from(media)
    .where(eq(media.id, mediaId));

  if (!mediaRecord) {
    throw new Error("Media record not found.");
  }

  // 1. Delete from Cloudinary
  await cloudinary.uploader.destroy(mediaRecord.cloudinaryPublicId);

  // 2. Soft-delete in database to preserve referential integrity
  await db.update(media).set({ isDeleted: true }).where(eq(media.id, mediaId));

  return { success: true };
}
