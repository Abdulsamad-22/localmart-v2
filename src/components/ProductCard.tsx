"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "@phosphor-icons/react";
import { CurrencyNgn } from "@phosphor-icons/react";
import useWishlistStore from "@/state-store/wishlistStore";
import useCartStore from "@/state-store/cartStore";
import { VendorDistance } from "./vendors/VendorDistance";
import type { ProductsWithVendor } from "@/types/product";

type Props = {
  product: ProductsWithVendor;
};

export function ProductCard({ product }: Props) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="bg-white border rounded-[4px] md:rounded-[10px]">
      <div className="w-full h-[8.5rem] md:h-[218px] relative cursor-pointer">
        <Link href={`/products/${product.id}`}>
          <img
            className="w-full h-full rounded-t-[4px] md:rounded-t-[10px]"
            src={product.image_url}
            alt={product.name}
          />
        </Link>

        <Heart
          onClick={() => toggleWishlist(product)}
          weight={isWishlisted ? "fill" : "regular"}
          className="absolute right-2 top-2 text-[#009688] text-[1.25rem] md:text-[1.5rem]"
        />
      </div>

      <div className="px-3 py-3 space-y-[6px] md:space-y-3 rounded-b-[8px] md:rounded-b-[10px]">
        <h2 className="md:font-semibold text-[0.875rem] md:text-[1rem] text-gray-900 line-clamp-1">
          {product.name}
        </h2>

        <div className="space-y-2 md:space-y-4">
          <div className="hidden md:flex items-center">
            <div className="h-6 md:h-8 w-6 md:w-8 bg-[#B7FDF6] rounded-full flex items-center justify-center mr-2 text-[0.875rem]">
              {product.vendor.business_name?.[0]?.toUpperCase() || ""}
            </div>
            <span className="text-[0.875rem] md:text-[1rem] line-clamp-1">
              {product.vendor.business_name || ""}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <img src="/images/Star.svg" alt="Rating" className="w-4 h-4" />
            <span className="font-medium">4.5</span>
            <span className="text-xs font-normal">(120 reviews)</span>
          </div>

          <div className="space-y-[3px] md:space-y-2">
            <span className="flex items-center font-medium md:font-semibold text-[0.75rem] md:text-[1rem] text-gray-900">
              <CurrencyNgn className="mr-[0.5px] text-[1rem] md:text-[1.25rem]" />
              {Number(product.item_price).toLocaleString()}
            </span>

            <div className="flex items-center gap-[2px] text-[0.75rem] md:text-[0.875rem] text-gray-600">
              <VendorDistance vendor={product.vendor} />
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <button
            onClick={() => addToCart(product)}
            className="flex items-center justify-center gap-2 w-full text-[0.875rem] md:text-[1rem] px-4 py-2 bg-gradient-to-r from-[#009688] to-[#00695C] hover:from-[#00897B] hover:to-[#005B4F] transition-all duration-200 text-white rounded-[8px] mt-2 md:mt-4"
          >
            <ShoppingCart size={24} color="#fff" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
