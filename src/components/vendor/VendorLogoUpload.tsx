"use client";

import { useState } from "react";
import { Camera, X } from "@phosphor-icons/react";
import { validateImage } from "@/lib/products/validateImage";
import { createPreview, revokePreview } from "@/lib/products/createPreview";
import { compressImage } from "@/lib/products/compressImage";
import { toast } from "sonner";

type Props = {
  logo: File | null;
  setLogo: (file: File | null) => void;
};

export function VendorLogoUpload({ logo, setLogo }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    const validationError = validateImage(file);
    if (validationError) {
      toast.error(validationError);
      e.target.value = "";
      return;
    }

    if (!file) return;

    setCompressing(true);

    try {
      const compressed = await compressImage(file);

      if (preview) revokePreview(preview);

      const previewUrl = createPreview(compressed);
      setLogo(compressed);
      setPreview(previewUrl);
    } catch {
      toast.error("Failed to process image. Please try another.");
      e.target.value = "";
    } finally {
      setCompressing(false);
    }
  };

  const handleRemove = () => {
    if (preview) revokePreview(preview);
    setLogo(null);
    setPreview(null);
  };

  return (
    <div>
      <label className="block text-[0.9375rem] font-medium text-gray-700 mb-2">
        Store logo
        <span className="text-gray-500 font-normal ml-1">(optional)</span>
      </label>
      <p className="text-[0.875rem] text-gray-600 mb-3">
        Displayed on your public store page. Square image recommended.
      </p>

      <div className="flex items-center gap-4">
        {/* preview or placeholder */}
        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-400 overflow-hidden flex-shrink-0 relative">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Store logo preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              >
                <X size={10} className="text-white" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera size={20} className="text-gray-600" />
            </div>
          )}
        </div>

        {/* upload button */}
        <div>
          <label
            htmlFor="vendor-logo-upload"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-all
              ${compressing ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Camera size={15} />
            {compressing
              ? "Processing..."
              : preview
                ? "Change logo"
                : "Upload logo"}
          </label>
          <input
            id="vendor-logo-upload"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="sr-only"
          />
          <p className="text-xs text-gray-600 mt-1">
            JPG, PNG or WEBP · Max 15MB
          </p>
        </div>
      </div>
    </div>
  );
}
