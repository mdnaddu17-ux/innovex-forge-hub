import type { ConvexReactClient } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export interface UploadResult {
  storageId: Id<"_storage">;
  imageUrl: string;
}

export async function uploadImage(
  convex: ConvexReactClient,
  file: File
): Promise<UploadResult> {
  if (!file) throw new Error("Image required");

  if (!file.type.startsWith("image/"))
    throw new Error("Only image files allowed");

  if (file.size > 2 * 1024 * 1024)
    throw new Error("Image max size 2MB");

  // 1. Get a presigned upload URL from Convex
  const uploadUrl = await convex.mutation(api.mutations.generateUploadUrl, {});

  // 2. Upload the file to Convex storage
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!response.ok) throw new Error("Upload failed");

  const { storageId } = (await response.json()) as { storageId: Id<"_storage"> };

  // 3. Get the public URL for the stored file
  const imageUrl = await convex.mutation(api.mutations.getStorageUrl, { storageId });

  if (!imageUrl) throw new Error("Failed to get storage URL");

  return { storageId, imageUrl };
}
