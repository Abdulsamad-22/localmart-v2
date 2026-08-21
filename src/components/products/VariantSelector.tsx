"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "@phosphor-icons/react";
import type { Color, ProductRow } from "@/types/product";
import useCartStore from "@/state-store/cartStore";

type Props = {
  product: ProductRow;
  isOpen: boolean;
  onClose: (wasAdded?: boolean) => void;
};

export function VariantSelector({ product, isOpen, onClose }: Props) {
  const { addToCart, cartItems } = useCartStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  const colors: Color[] = Array.isArray(product.item_colors)
    ? (product.item_colors as Color[])
    : [];

  const hasVariants =
    (product.item_sizes && product.item_sizes.length > 0) || colors.length > 0;

  // pre-select from cart if already added
  const existingCartItem = cartItems.find((i) => i.product.id === product.id);

  const [selectedSize, setSelectedSize] = useState<string | null>(
    existingCartItem?.selectedSize ?? product.item_sizes?.[0] ?? null,
  );
  const [selectedColor, setSelectedColor] = useState<Color | null>(
    existingCartItem?.selectedColor ?? colors[0] ?? null,
  );

  // reset when product changes
  useEffect(() => {
    const cartItem = cartItems.find((i) => i.product.id === product.id);
    setSelectedSize(cartItem?.selectedSize ?? product.item_sizes?.[0] ?? null);
    setSelectedColor(cartItem?.selectedColor ?? colors[0] ?? null);
  }, [product.id, isOpen]);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedColor, selectedSize);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => onClose(false)}
          />

          {/* mobile — bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl md:hidden"
            style={{ maxHeight: "85vh" }}
          >
            <SheetContent
              product={product}
              colors={colors}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              setSelectedSize={setSelectedSize}
              setSelectedColor={setSelectedColor}
              onClose={onClose}
              onAddToCart={handleAddToCart}
            />
          </motion.div>

          {/* desktop — centered modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hidden md:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl"
          >
            <SheetContent
              product={product}
              colors={colors}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              setSelectedSize={setSelectedSize}
              setSelectedColor={setSelectedColor}
              onClose={() => onClose(false)}
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// shared content between mobile sheet and desktop modal
function SheetContent({
  product,
  colors,
  selectedSize,
  selectedColor,
  setSelectedSize,
  setSelectedColor,
  onClose,
  onAddToCart,
}: {
  product: ProductRow;
  colors: Color[];
  selectedSize: string | null;
  selectedColor: Color | null;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: Color) => void;
  onClose: () => void;
  onAddToCart: () => void;
}) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ maxHeight: "85vh" }}
    >
      {/* drag handle — mobile only */}
      <div className="md:hidden flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* close button */}
      <div className="flex items-center justify-between px-5 py-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 flex-1 mr-4">
          {product.item_name}
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>

      {/* scrollable content */}
      <div className="overflow-y-auto flex-1 px-5 pb-4 space-y-5">
        {/* product image + info */}
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={product.image_url}
              alt={product.item_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#009688] font-semibold text-lg mb-1">
              ₦{Number(product.item_price).toLocaleString("en-NG")}
            </p>
            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
              {product.item_description}
            </p>
          </div>
        </div>

        {/* sizes */}
        {product.item_sizes && product.item_sizes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-sm font-medium text-gray-900">Size</h4>
              {selectedSize && (
                <span className="text-xs text-gray-500">
                  Selected:{" "}
                  <span className="font-medium text-gray-900">
                    {selectedSize}
                  </span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.item_sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 active:scale-95
                    ${
                      selectedSize === size
                        ? "border-[#009688] bg-[#009688] text-white"
                        : "border-gray-200 text-gray-700 hover:border-[#009688] hover:text-[#009688]"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* colors */}
        {colors.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-sm font-medium text-gray-900">Color</h4>
              {selectedColor && (
                <span className="text-xs text-gray-500">
                  Selected:{" "}
                  <span className="font-medium text-gray-900">
                    {selectedColor.name}
                  </span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.code}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-150 active:scale-95 flex items-center justify-center
                    ${
                      selectedColor?.code === color.code
                        ? "border-[#009688] scale-110"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  style={{ backgroundColor: color.code }}
                >
                  {selectedColor?.code === color.code && (
                    <span
                      className={`text-[10px] font-bold
                        ${
                          ["#ffffff", "#ffff00", "#ffeb3b", "#fff9c4"].includes(
                            color.code.toLowerCase(),
                          )
                            ? "text-gray-800"
                            : "text-white"
                        }`}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* stock indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              product.item_units > 0 ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-500">
            {product.item_units > 0
              ? `${product.item_units} in stock`
              : "Out of stock"}
          </span>
        </div>
      </div>

      {/* add to cart button — sticky at bottom */}
      <div className="px-5 py-4 border-t border-gray-100">
        <button
          onClick={onAddToCart}
          disabled={product.item_units < 1}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#009688] hover:bg-[#00796B] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium transition-all active:scale-[0.98]"
        >
          <ShoppingCart size={20} />
          {product.item_units < 1 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
