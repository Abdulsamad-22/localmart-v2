"use client";

import Link from "next/link";
import { ProductsWithVendor } from "@/types/product";
import ShopCard from "./ShopCard";

type Props = {
  products: ProductsWithVendor[];
  isOwner?: boolean;
};

export default function ShopDisplay({ products, isOwner = false }: Props) {
  return (
    <div>
      <div className="flex justify-between items-center px-6 md:px-12 mb-6">
        <h2 className="text-[1rem] md:text-[1.5rem] font-semibold">
          {isOwner ? "My Products" : "Products"} ({products.length})
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {isOwner
              ? "You haven't added any products yet."
              : "No products available in this shop yet."}
          </p>
          {isOwner && (
            <Link
              href={"/add-product"}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add Your First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-[49%_49%] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 md:gap-x-4 gap-y-8 md:gap-y-12 px-6 md:px-12">
          {products.map((product) => (
            <ShopCard key={product.id} product={product} isOwner={isOwner} />
          ))}
        </div>
      )}
    </div>
  );
}
