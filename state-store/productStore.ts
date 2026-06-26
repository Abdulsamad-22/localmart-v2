import { create } from "zustand";
import { ProductRow } from "@/types/product";

type CartItem = {
  product: ProductRow;
  quantity: number;
};

type ProductStore = {
  products: CartItem[];
  editingProduct: ProductRow | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setEditingProduct: (item: ProductRow | null) => void;
  setProducts: (item: CartItem[]) => void;
};

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  searchQuery: "",
  editingProduct: null,
  setProducts: (item) => set({ products: item }),
  setEditingProduct: (item) => set({ editingProduct: item }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useProductStore;
