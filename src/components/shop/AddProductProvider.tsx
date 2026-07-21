"use client";

import { FormProvider, useForm } from "react-hook-form";
import { object, string, InferType, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ProductImageUpload from "./ProductImageUpload";
import ProductVaraiant from "./ProductVariant";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/products/createProduct";
import AddProductForm from "./AddProductForm";

const productSchema = object({
  productName: string().required("Product name is required"),
  category: string().required("Product category is required"),
  description: string().max(1000).required("Please describe product"),
  price: string().required("Price is required"),
  units: string().required("Available Product unit is required"),

  item_colors: array()
    .of(
      object({
        name: string().required(),
        code: string().required(),
      }),
    )
    .optional()
    .default([]),

  item_sizes: array().of(string().required()).optional().default([]),
});

export type ProductFormData = InferType<typeof productSchema>;

export default function AddProductProvider() {
  const methods = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      productName: "",
      category: "",
      description: "",
      price: "",
      units: "",
      item_colors: [],
      item_sizes: [],
    },
  });
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  async function handleSubmit(data: ProductFormData) {
    if (!image) {
      toast.error("Please upload a product image.");
      return;
    }

    setSubmitting(true);

    try {
      const supabase = getSupabaseClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Session expired. Please log in again.");
        router.push("/login?redirectTo=/add-product");
        return;
      }

      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("vendor_id", session.user.id)
        .single();

      if (!vendor) {
        toast.error("Vendor account not found.");
        router.push("/vendor/register");
        return;
      }

      await createProduct(data, image, vendor.id);

      toast.success("Product created successfully.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create product";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="w-full flex flex-col md:flex-row items-start gap-8 my-12 px-4 md:px-12 space-y-6"
        >
          <AddProductForm />
          <div className="w-full md:w-1/2">
            <ProductImageUpload image={image} setImage={setImage} />
            <ProductVaraiant />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
