"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "@phosphor-icons/react";
import useCartStore from "@/state-store/cartStore";
import type { ProductsWithVendor } from "@/types/product";
import type { Color } from "@/types/product";

type Props = {
  product: ProductsWithVendor;
  quantity?: number;
  selectedColor?: Color | null;
  selectedSize?: string | null;
  className?: string;
};

export function AddToCartButton({
  product,
  quantity = 1,
  selectedColor = null,
  selectedSize = null,
  className,
}: Props) {
  const { addToCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (product.item_units < 1) return;

    // haptic feedback on mobile
    if (navigator.vibrate) navigator.vibrate([20, 10, 20]);

    addToCart(product, quantity, selectedColor, selectedSize);

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.button
      onClick={handleAdd}
      disabled={product.item_units < 1 || added}
      whileTap={{ scale: 0.96 }}
      className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 disabled:cursor-not-allowed
        ${
          product.item_units < 1
            ? "bg-gray-300 text-gray-500"
            : added
              ? "bg-gray-400"
              : "bg-gradient-to-r from-[#009688] to-[#00695C] hover:from-[#00897B] hover:to-[#005B4F]"
        } ${className}`}
    >
      <AnimatePresence mode="wait">
        {added ? (
          <motion.div
            key="added"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <Check size={20} weight="bold" />
            Added to cart
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            {product.item_units < 1 ? "Out of stock" : "Add to cart"}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
