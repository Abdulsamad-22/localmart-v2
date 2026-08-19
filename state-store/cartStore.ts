import { ProductRow, Color } from "@/types/product";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/types/cart";

type CartStore = {
  cartItems: CartItem[];
  checkoutItem: CartItem | null;
  removeFromCart: (
    productId: string,
    selectedColor?: Color | null,
    selectedSize?: string | null,
  ) => void;
  increaseCart: (productId: string) => void;
  decreaseCart: (productId: string) => void;
  setCheckoutItem: (item: CartItem | null) => void;
  addToCart: (
    product: ProductRow,
    quantity: number,
    selectedColor?: Color | null,
    selectedSize?: string | null,
  ) => void;
  addMultipleToCart: (products: ProductRow[]) => void;
  clearCart: () => void;
};

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      checkoutItem: null,

      addToCart: (
        product: ProductRow,
        quantity?: number,
        selectedColor?: Color | null,
        selectedSize?: string | null,
      ) => {
        const { cartItems } = get();
        const newCart = [...cartItems];

        // normalise incoming values
        const normalizedColor = selectedColor ?? null;
        const normalizedSize = selectedSize ?? "";

        const existingIndex = newCart.findIndex(
          (item) =>
            item.product.id === product.id &&
            (item.selectedColor?.code ?? null) ===
              (normalizedColor?.code ?? null) &&
            (item.selectedSize ?? "") === normalizedSize,
        );

        if (existingIndex !== -1) {
          const existing = newCart[existingIndex];
          if (existing.quantity >= existing.product.item_units) {
            console.warn(`Maximum quantity reached: ${product.item_name}`);
            return;
          }
          newCart[existingIndex] = {
            ...existing,
            quantity: existing.quantity + (quantity ?? 1),
          };
        } else {
          newCart.push({
            product,
            quantity: quantity ?? 1,
            selectedColor: normalizedColor,
            selectedSize: normalizedSize,
          });
        }

        set({ cartItems: newCart });
      },

      addMultipleToCart: (products: ProductRow[]) => {
        products.forEach((p) => get().addToCart(p, 1));
      },

      setCheckoutItem: (item) => set({ checkoutItem: item }),

      increaseCart: (productId: string) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }));
      },

      decreaseCart: (productId: string) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          ),
        }));
      },

      removeFromCart: (
        productId: string,
        selectedColor?: Color | null,
        selectedSize?: string | null,
      ) =>
        set({
          cartItems: get().cartItems.filter((i) => {
            if (i.product.id !== productId) return true;

            // same product — check color and size to find exact item
            const sameColor =
              selectedColor === undefined
                ? true
                : i.selectedColor?.code === selectedColor?.code;

            const sameSize =
              selectedSize === undefined
                ? true
                : i.selectedSize === selectedSize;

            // remove only the item that matches all three
            return !(sameColor && sameSize);
          }),
        }),

      clearCart: () => set({ cartItems: [] }),

      total: () =>
        get().cartItems.reduce(
          (sum, i) => sum + i.product.item_price * i.quantity,
          0,
        ),
    }),
    {
      name: "localmart-cart", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // only persist the cart items, not checkout state
      partialize: (state) => ({ cartItems: state.cartItems }),
    },
  ),
);

export default useCartStore;
