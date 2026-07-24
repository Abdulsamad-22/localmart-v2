"use client";

import WishlistButton from "@/lib/wishlist/WishlistButton";
import useCartStore from "@/state-store/cartStore";
import useProductStore from "@/state-store/productStore";
import { ProductsWithVendor } from "@/types/product";
import {
  CurrencyNgn,
  PencilSimple,
  ShoppingCart,
  Trash,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  product: ProductsWithVendor;
  isOwner?: boolean;
};
export default function ShopCard({ product, isOwner = false }: Props) {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { setEditingProduct } = useProductStore();

  const handleEditProduct = (product: ProductsWithVendor) => {
    // Navigate to edit product page
    setEditingProduct(product);
    router.push("/add-product");
  };
  return (
    <div
      key={product.id}
      className="border border-[#c4c4c4] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="w-full md:w-full h-[8.5rem] md:h-[218px] relative cursor-pointer">
        {product.image_url && (
          <Link href={`/products/${product.id}`}>
            <img
              src={product.image_url}
              alt={product.item_name}
              className="w-full h-full rounded-t-[4px] md:rounded-t-[10px]"
            />
          </Link>
        )}
        {!isOwner && <WishlistButton product={product} />}
      </div>

      <div className="p-2 md:p-4">
        <h3 className="md:font-semibold text-[0.875rem] md:text-[1rem] mb-1 md:mb-2 line-clamp-1">
          {product.item_name}
        </h3>
        {product.item_description && (
          <p className="text-gray-600 text-[0.75rem] md:text-[0.875rem] mb-3 line-clamp-3">
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
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.item_units === 0}
            className={`hidden md:flex w-full py-2 rounded transition-colors ${
              product.item_units === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200 hover:from[#00897B] hover:to-[#005B4F] text-[#fff]"
            }`}
          >
            {product.item_units !== 0 ? <ShoppingCart size={20} /> : ""}
            {product.item_units === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        ) : (
          // Owner view - Edit/Delete buttons
          <div className="flex gap-2">
            <button
              // onClick={() => handleDeleteProduct(product.id)}
              className="flex items-center justify-center gap-2 flex-1 bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200"
            >
              <Trash size={18} />
              Delete
            </button>
            <button
              onClick={() => handleEditProduct(product)}
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
