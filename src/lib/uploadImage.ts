import { supabase } from "@/lib/supabase";

export async function uploadImage(
  file: File,
  bucket: "project-images" | "goal-images" = "project-images"
): Promise<string> {
  if (!file) throw new Error("Image required");

  if (!file.type.startsWith("image/"))
    throw new Error("Only image files allowed");

  if (file.size > 2 * 1024 * 1024)
    throw new Error("Image max size 2MB");

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  if (!data?.publicUrl) throw new Error("Public URL generation failed");

  return data.publicUrl;
}
