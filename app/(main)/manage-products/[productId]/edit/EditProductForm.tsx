"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CurrencyNgn, ArrowLeft, Camera } from "@phosphor-icons/react";
import type { Resolver } from "react-hook-form";
import {
  productSchema,
  type ProductFormData,
} from "@/src/components/shop/AddProductProvider";
import { editProduct } from "@/lib/products/editProduct";
import { validateImage } from "@/lib/products/validateImage";
import { compressImage } from "@/lib/products/compressImage";
import { createPreview, revokePreview } from "@/lib/products/createPreview";
import type { ProductRow } from "@/types/product";
import ProductColorOption from "@/src/components/shop/ProductColorOption";
import ProductSizesOption from "@/src/components/shop/ProductSizesOption";

const PRODUCT_CATEGORIES = [
  "Fashion & Clothing",
  "Food & Groceries",
  "Electronics",
  "Beauty & Personal Care",
  "Home & Furniture",
  "Health & Wellness",
  "Sports & Fitness",
  "Books & Stationery",
  "Baby & Kids",
  "Phones & Accessories",
  "Agriculture & Farm Produce",
  "Art & Crafts",
  "Other",
];

type Props = {
  product: ProductRow;
};

export function EditProductForm({ product }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  const methods = useForm<ProductFormData>({
    resolver: yupResolver(
      productSchema,
    ) as unknown as Resolver<ProductFormData>,
    defaultValues: {
      productName: product.item_name,
      category: product.item_category,
      description: product.item_description,
      price: Number(product.item_price).toLocaleString("en-NG"),
      units: String(product.item_units),
      item_colors: product.item_colors ?? [],
      item_sizes: product.item_sizes ?? [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  // cleanup preview on unmount
  useEffect(() => {
    return () => {
      if (preview) revokePreview(preview);
    };
  }, [preview]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setPreview(createPreview(compressed));
      setNewImage(compressed);
    } catch {
      toast.error("Failed to process image.");
      e.target.value = "";
    } finally {
      setCompressing(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);

    try {
      const result = await editProduct(
        product.id,
        data,
        newImage,
        product.image_url,
      );

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Product updated successfully.");
      router.replace("/manage-products");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* left — main fields */}
          <div className="flex-1 space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h2 className="text-sm font-medium text-gray-900">
                Product details
              </h2>

              {/* product name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product name
                </label>
                <input
                  {...register("productName")}
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688]"
                />
                {errors.productName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              {/* description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  {...register("category")}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688]"
                >
                  <option value="">Select category</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* price + units */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price
                  </label>
                  <div className="relative">
                    <CurrencyNgn
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      {...register("price")}
                      type="text"
                      inputMode="numeric"
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688]"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Stock units
                  </label>
                  <input
                    {...register("units")}
                    type="number"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688]"
                  />
                  {errors.units && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.units.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* save button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft size={16} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg bg-[#009688] hover:bg-[#00796B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-all"
              >
                {submitting ? (
                  <>
                    <i
                      className="ti ti-loader-2 animate-spin"
                      aria-hidden="true"
                    />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>

          {/* right — image + variants */}
          <div className="md:w-100 space-y-5">
            {/* image */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-medium text-gray-900 mb-3">
                Product image
              </h2>

              {/* current or new preview */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                <img
                  src={preview ?? product.image_url}
                  alt={product.item_name}
                  className="w-full h-full object-cover"
                />
                {preview && (
                  <span className="absolute top-2 left-2 bg-[#009688] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                    New image
                  </span>
                )}
              </div>

              <label
                htmlFor="edit-product-image"
                className={`flex items-center justify-center gap-2 w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:border-[#009688] hover:text-[#009688] transition-colors
                  ${compressing ? "opacity-50 pointer-events-none" : ""}`}
              >
                <Camera size={16} />
                {compressing ? "Processing..." : "Replace image"}
              </label>
              <input
                id="edit-product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
              <p className="text-xs text-gray-400 mt-1.5 text-center">
                Optional — only if you want to change the image
              </p>
            </div>

            {/* sizes */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-medium text-gray-900 mb-3">
                Sizes
                <span className="text-gray-400 font-normal ml-1">
                  (optional)
                </span>
              </h2>
              <ProductSizesOption />
            </div>

            {/* colors */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-medium text-gray-900 mb-3">
                Colors
                <span className="text-gray-400 font-normal ml-1">
                  (optional)
                </span>
              </h2>
              <ProductColorOption />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
