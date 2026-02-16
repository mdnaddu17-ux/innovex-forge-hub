import { supabase } from "@/lib/supabase";

export async function uploadImage(file: File): Promise<string> {
  if (!file) throw new Error("No image selected");

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("project-images")
    .getPublicUrl(fileName);

  if (!data?.publicUrl) throw new Error("Image URL failed");

  return data.publicUrl;
}
