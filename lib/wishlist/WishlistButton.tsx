"use client";

import useWishlistStore from "@/state-store/wishlistStore";
import { ProductsWithVendor } from "@/types/product";
import { useState, useEffect } from "react";
import { Heart } from "@phosphor-icons/react";

type Props = {
  product: ProductsWithVendor;
};

export default function WishlistButton({ product }: Props) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  return (
    <Heart
      onClick={() => {
        toggleWishlist(product);
        setIsWishlisted(!isWishlisted);
      }}
      weight={isWishlisted ? "fill" : "regular"}
      className="absolute right-2 top-2 text-[#009688] text-[1.25rem] md:text-[1.5rem]"
    />
  );
}
