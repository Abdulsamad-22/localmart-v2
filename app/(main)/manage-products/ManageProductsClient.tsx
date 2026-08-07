// app/(main)/manage-products/ManageProductsClient.tsx
"use client";

import { ManageProductCard } from "@/src/components/shop/ManageProductsCard";
import type { ProductsWithVendor } from "@/types/product";

type Props = {
  products: ProductsWithVendor[];
};

export function ManageProductsClient({ products }: Props) {
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

        <a
          href="/add-product"
          className="text-sm font-medium text-[#009688] hover:underline"
        >
          Add a product
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-4 gap-y-6 md:gap-y-8">
      {products.map((product) => (
        <ManageProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
