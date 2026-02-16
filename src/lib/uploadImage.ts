import { supabase } from "@/lib/supabase";

export async function uploadImage(file: File): Promise<string> {
  if (!file) throw new Error("Image required");

  if (!file.type.startsWith("image/"))
    throw new Error("Only image files allowed");

  if (file.size > 2 * 1024 * 1024)
    throw new Error("Image max size 2MB");

  const filePath = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("uploads")
    .getPublicUrl(filePath);

  if (!data?.publicUrl) throw new Error("Public URL generation failed");

  return data.publicUrl;
}
