"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "@phosphor-icons/react";
import { VariantSelector } from "./VariantSelector";
import type { ProductRow } from "@/types/product";
import useCartStore from "@/state-store/cartStore";
import type { Color } from "@/types/product";

type Props = {
  product: ProductRow;
  className?: string;
  quantity?: number;
  selectedColor?: Color | null;
  selectedSize?: string | null;
  variant?: "default" | "mobile-icon";
};

export function AddToCartButton({
  product,
  className,
  variant = "default",
}: Props) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCartStore();

  const hasVariants =
    (product.item_sizes && product.item_sizes.length > 0) ||
    (Array.isArray(product.item_colors) && product.item_colors.length > 0);

  const handleClick = () => {
    if (product.item_units < 1) return;
    if (navigator.vibrate) navigator.vibrate([20, 10, 20]);

    if (hasVariants) {
      setSelectorOpen(true);
    } else {
      addToCart(product, 1, null, null);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const handleSelectorClose = () => {
    setSelectorOpen(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      {variant === "mobile-icon" ? (
        // Mobile icon button
        <button
          onClick={handleClick}
          disabled={product.item_units < 1}
          className={`px-3 py-1.5 border rounded-[16px] transition-all active:scale-95
            ${
              added ? "bg-gray-400" : "border-[#727876] hover:border-[#009688]"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {added ? (
            <Check size={14} className="text-[#fff]" />
          ) : (
            <ShoppingCart size={14} color="#2C3230" />
          )}
        </button>
      ) : (
        // Default full button
        <motion.button
          onClick={handleClick}
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
      )}

      <VariantSelector
        product={product}
        isOpen={selectorOpen}
        onClose={handleSelectorClose}
      />
    </>
  );
}
