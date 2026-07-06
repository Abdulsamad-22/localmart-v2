import { WishlistProducts } from "@/types/product";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type WishlistItem = {
  product: WishlistProducts;
};

type WishlistStore = {
  wishlistItems: WishlistItem[];
  toggleWishlist: (product: WishlistProducts) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};

const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistItems: [],
      toggleWishlist: (product: WishlistProducts) => {
        const { wishlistItems } = get();

        const exists = wishlistItems.some(
          (item) => item.product.id === product.id,
        );

        if (exists) {
          set({
            wishlistItems: wishlistItems.filter(
              (item) => item.product.id !== product.id,
            ),
          });
        } else {
          set({
            wishlistItems: [...wishlistItems, { product }],
          });
        }
      },

      removeFromWishlist: (productId) => {
        const { wishlistItems } = get();

        set({
          wishlistItems: wishlistItems.filter(
            (item) => item.product.id !== productId,
          ),
        });
      },

      isInWishlist: (productId: string) => {
        const { wishlistItems } = get();

        return wishlistItems.some((item) => item.product.id === productId);
      },

      clearWishlist: () => set({ wishlistItems: [] }),
    }),
    {
      name: "localmart-cart", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // only persist the cart items, not checkout state
      partialize: (state) => ({ wishlistItems: state.wishlistItems }),
    },
  ),
);

export default useWishlistStore;
