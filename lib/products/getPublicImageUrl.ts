import { getSupabaseClient } from "../supabase/client";

export function getPublicImageUrl(path: string): string {
  if (!path) return "";

  return getSupabaseClient().storage.from("product-images").getPublicUrl(path)
    .data.publicUrl;
}
