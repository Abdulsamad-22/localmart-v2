"use client";

import { useState } from "react";
import { Upload } from "@phosphor-icons/react";
import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./AddProductProvider";

export default function ProductImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useFormContext<ProductFormData>();

  const selectedImage = watch("selectedImage");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      setError("selectedImage", {
        type: "manual",
        message: "Please select an image file",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("selectedImage", {
        type: "manual",
        message: "Please upload a valid image file (JPG, PNG, WEBP)",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("selectedImage", {
        type: "manual",
        message: "Image must be smaller than 5MB",
      });
      return;
    }

    clearErrors("selectedImage");
    setUploading(true);

    const reader = new FileReader();

    reader.onloadend = () => {
      try {
        const result = reader.result;

        // narrow to string before using string methods
        if (typeof result !== "string") {
          setError("selectedImage", {
            type: "manual",
            message: "Failed to read image file",
          });
          return;
        }

        const base64 = result.split(",")[1];

        if (!base64) {
          setError("selectedImage", {
            type: "manual",
            message: "Failed to process image",
          });
          return;
        }

        setValue(
          "selectedImage",
          { name: file.name, data: base64, type: file.type },
          { shouldValidate: true },
        );

        setPreview(result); // result is confirmed string here
        setImageFile(file);
      } catch (err) {
        setError("selectedImage", {
          type: "manual",
          message: "Failed to process image",
        });
      } finally {
        setUploading(false); // always runs — one place, no duplication
      }
    };

    reader.onerror = () => {
      setError("selectedImage", {
        type: "manual",
        message: "Failed to read image file",
      });
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2 mx-auto text-gray-800 mb-12">
      <label className="block text-[1rem] text-gray-800 font-medium mb-1">
        Upload or drag product image here
      </label>
      <div className="relative border-[2px] border-[#009688] border-dashed rounded-lg">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          id="product-image-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageUpload(file);
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* upload area */}
        <div className="w-[301.75px] h-[218px]">
          <div
            className="w-full h-full py-4
               flex flex-col items-center justify-center cursor-pointer 
               hover:border-blue-500 transition-colors overflow-hidden"
          >
            {preview ? (
              <img
                src={`data:${selectedImage.type};base64,${selectedImage.data}`}
                alt="Preview"
                className="w-[301.75px] h-[218px] object-cover rounded-lg"
              />
            ) : (
              <>
                <div className="text-5xl text-[#009688] mb-2">
                  <Upload size={32} />
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  Upload or drag product image here
                </p>
              </>
            )}
          </div>
          {errors.selectedImage?.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.selectedImage.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
