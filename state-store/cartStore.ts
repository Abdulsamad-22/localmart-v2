import { ProductRow } from "@/types/product";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartItem = {
  product: ProductRow;
  quantity: number;
};

type CartStore = {
  cartItems: CartItem[];
  checkOutItem: CartItem | null;
  addToCart: (product: ProductRow) => void;
};

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      checkOutItem: null,

      addToCart: (product: ProductRow) => {
        const { cartItems } = get();
        const newCart = [...cartItems];
        const existingIndex = newCart.findIndex(
          (item) => item.product.id === product.id,
        );

        if (existingIndex !== -1) {
          const existing = newCart[existingIndex];
          if (existing.quantity >= existing.product.item_units) {
            console.warn(`Maximum quantity reached: ${product.name}`);
            return;
          }
          newCart[existingIndex] = {
            ...existing,
            quantity: existing.quantity + 1,
          };
        } else {
          newCart.push({ product, quantity: 1 });
        }

        set({ cartItems: newCart });
      },

      addMultipleToCart: (products: ProductRow[]) => {
        products.forEach((p) => get().addToCart(p));
      },

      increaseCart: (productId: number) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }));
      },

      decreaseCart: (productId: number) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          ),
        }));
      },

      removeFromCart: (productId: number) =>
        set({
          cartItems: get().cartItems.filter((i) => i.product.id !== productId),
        }),

      clearCart: () => set({ cartItems: [] }),

      total: () =>
        get().cartItems.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
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
