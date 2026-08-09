"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "@phosphor-icons/react";
import useWishlistStore from "@/state-store/wishlistStore";
import type { ProductsWithVendor } from "@/types/product";

type Props = {
  product: ProductsWithVendor;
};

export function WishlistButton({ product }: Props) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const handleToggle = () => {
    toggleWishlist(product);
    const next = !isWishlisted;
    setIsWishlisted(next);

    if (next) {
      setBurst(true);
      setTimeout(() => setBurst(false), 600);

      // haptic on mobile
      if (navigator.vibrate) navigator.vibrate(30);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="absolute right-2 top-2"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <motion.div
        animate={burst ? { scale: [1, 1.4, 0.9, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Heart
          weight={isWishlisted ? "fill" : "regular"}
          className={`text-[1.25rem] md:text-[1.5rem] transition-colors duration-200
            ${isWishlisted ? "text-[#009688]" : "text-[#009688]"}`}
          size={22}
        />
      </motion.div>

      {/* burst particles */}
      <AnimatePresence>
        {burst && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 20,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 20,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-teal-500"
                style={{ marginTop: "-3px", marginLeft: "-3px" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </button>
  );
}
