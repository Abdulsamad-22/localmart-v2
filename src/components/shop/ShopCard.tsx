"use client";

import { WishlistButton } from "@/lib/wishlist/WishlistButton";
import { AddToCartButton } from "../products/AddtoCartButton";
import useCartStore from "@/state-store/cartStore";
import { ProductsWithVendor } from "@/types/product";
import {
  CurrencyNgn,
  PencilSimple,
  ShoppingCart,
  Trash,
} from "@phosphor-icons/react";
import Link from "next/link";

type Props = {
  product: ProductsWithVendor;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
};
export default function ShopCard({
  product,
  isOwner = false,
  onDelete,
  onEdit,
}: Props) {
  const { addToCart } = useCartStore();

  return (
    <div
      key={product.id}
      className={`bg-white border border-[#dee4e1] overflow-hidden ${isOwner ? "rounded-t-[10px]" : "rounded-[10px]"} hover:shadow-md transition-shadow`}
    >
      <div className="relative h-36 w-full cursor-pointer overflow-hidden md:h-[218px]">
        <div className="relative h-36 w-full cursor-pointer overflow-hidden md:h-[218px]">
          {product.image_url &&
            (isOwner ? (
              // vendor view — just the image, no link
              <img
                src={product.image_url}
                alt={product.item_name}
                className="block h-full w-full object-cover"
              />
            ) : (
              // buyer view — clickable link to product detail
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.image_url}
                  alt={product.item_name}
                  className="block h-full w-full object-cover"
                />
              </Link>
            ))}

          {!isOwner && <WishlistButton product={product} />}
        </div>

        {!isOwner && <WishlistButton product={product} />}
      </div>

      <div className="p-2 md:p-4">
        <h3 className="md:font-semibold text-[0.875rem] md:text-[1rem] mb-1 md:mb-2 line-clamp-1">
          {product.item_name}
        </h3>
        {product.item_description && (
          <p className="text-gray-600 text-[0.75rem] md:text-[0.875rem] mb-3 min-h-[3.75rem] line-clamp-3">
            {product.item_description}
          </p>
        )}
        <div className="flex justify-between items-center mb-3">
          <span className="flex items-center font-semibold text-[0.875rem] md:text-[1rem]">
            <CurrencyNgn className="text-[1rem] md:text-[1.18rem]" />
            {Number(product.item_price || 0).toLocaleString("en-NG")}
          </span>
          {product.item_units !== undefined && (
            <span
              className={`text-[0.75rem] md:text-[0.875rem] ${
                product.item_units > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.item_units > 0
                ? `Stock: ${product.item_units}`
                : "Out of Stock"}
            </span>
          )}
        </div>

        {/* Action buttons */}
        {!isOwner ? (
          // Customer view - Add to Cart button
          <>
            <AddToCartButton product={product} />
            {product.item_units < 1 && (
              <div className="bg-gray-300 text-gray-500 cursor-not-allowed py-2">
                Out of Stock
              </div>
            )}
          </>
        ) : (
          // Owner view - Edit/Delete buttons
          <div className="flex gap-2">
            <button
              onClick={() => onDelete && onDelete(product.id)}
              className="flex items-center justify-center gap-2 flex-1 bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200"
            >
              <Trash size={18} />
              Delete
            </button>
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-blue-50"
            >
              <PencilSimple size={18} />
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
