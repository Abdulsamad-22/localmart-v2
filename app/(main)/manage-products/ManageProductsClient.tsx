"use client";

import { useState } from "react";
import ShopCard from "@/src/components/shop/ShopCard";
import type { ProductsWithVendor } from "@/types/product";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/products/deleteProducts";
import { toast } from "sonner";
import { ConfirmDialog } from "@/src/components/ui/ConfirmDialog";
import Link from "next/link";

type Props = {
  products: ProductsWithVendor[];
  vendorId: string;
};

export function ManageProductsClient({ products, vendorId }: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [productToDelete, setProductToDelete] =
    useState<ProductsWithVendor | null>(null);

  const handleDeleteClick = (product: ProductsWithVendor) => {
    setProductToDelete(product); // store which product was selected
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);

    const result = await deleteProduct(productToDelete.id);

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete product.");
      setDeleting(false);
      return;
    }

    toast.success(`"${productToDelete.item_name}" deleted.`);
    setProductToDelete(null);
    router.refresh();
    setDeleting(false);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <i
            className="ti ti-package text-gray-400 text-2xl"
            aria-hidden="true"
          />
        </div>
        <p className="text-gray-900 dark:text-white font-medium mb-1">
          No products yet
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Add your first product to start selling
        </p>

        <Link
          href="/add-product"
          className="text-sm font-medium text-[#009688] hover:underline"
        >
          Add a product
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-4 gap-y-6 md:gap-y-8">
      {products.map((product) => (
        <ShopCard
          key={product.id}
          product={product}
          isOwner={true}
          onDelete={() => handleDeleteClick(product)}
        />
      ))}

      <ConfirmDialog
        isOpen={!!productToDelete}
        title="Delete product"
        description={`Are you sure you want to delete "${productToDelete?.item_name}"? This cannot be undone.`}
        confirmLabel="Delete product"
        onConfirm={handleDelete}
        onCancel={() => setProductToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
