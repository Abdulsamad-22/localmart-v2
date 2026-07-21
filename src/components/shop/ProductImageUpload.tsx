"use client";

import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { createPreview } from "@/lib/products/createPreview";
import { validateImage } from "@/lib/products/validateImage";
import { compressImage } from "@/lib/products/compressImage";
import { revokePreview } from "@/lib/products/createPreview";
import { ImageUpload } from "./ImageUpload";

type Props = {
  image: File | null;
  setImage: (image: File | null) => void;
};
export default function ProductImageUpload({ setImage, image }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    const validationError = validateImage(file);

    if (validationError) {
      toast.error(validationError);
      setImageError(validationError);
      e.target.value = ""; // reset so same file can be reselected
      return;
    }

    if (!file) return; // extra guard — satisfies TypeScript without assertion

    setCompressing(true); // show loading state

    try {
      const compressed = await compressImage(file);

      if (preview) {
        revokePreview(preview); // free old preview memory
      }

      const previewUrl = createPreview(compressed);
      setImage(compressed);
      setPreview(previewUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to process image";
      toast.error(message);
      e.target.value = ""; // reset on failure too
    } finally {
      setCompressing(false);
    }
  }

  const handleRemoveImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview(null);
    setImageError("");
  };

  return (
    <div className="space-y-2 flex flex-col items-center mx-auto text-gray-800 mb-12">
      <ImageUpload
        image={image}
        preview={preview}
        onChange={handleImageChange}
        onRemove={handleRemoveImage}
      />
    </div>
  );
}
