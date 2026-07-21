import { getSupabaseClient } from "../supabase/client";

type UploadImageResult = {
  url: string;
  path: string;
};

export async function uploadProductImage(
  file: File,
  vendorId: string,
): Promise<UploadImageResult> {
  const supabase = getSupabaseClient();

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${vendorId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  return { url: urlData.publicUrl, path };
}
