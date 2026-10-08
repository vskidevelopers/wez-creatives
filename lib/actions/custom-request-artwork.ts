"use server";

import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema/media";


const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/svg+xml", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadCustomRequestArtworkAction(file: File) {
  // Force Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, PNG, SVG, and PDF files are allowed.");
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 10MB limit.");
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Cloudinary in the artwork folder
  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "wez-creatives/artwork",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  // Save media record to database
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

  return {
    id: newMedia.id,
    secureUrl: newMedia.secureUrl,
    originalFilename: newMedia.originalFilename,
  };
}