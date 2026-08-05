import { create } from "zustand";
import { ProductsWithVendor } from "@/types/product";

type ProductStore = {
  products: ProductsWithVendor[];
  editingProduct: ProductsWithVendor | null;
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setEditingProduct: (item: ProductsWithVendor | null) => void;
  setProducts: (item: ProductsWithVendor[]) => void;
  setSelectedCategory: (category: string) => void;
};

const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  searchQuery: "",
  editingProduct: null,
  selectedCategory: "",
  setProducts: (item) => set({ products: item }),
  setEditingProduct: (item) => set({ editingProduct: item }),
  setSearchQuery: (query) => set({ searchQuery: query, selectedCategory: "" }),
  setSelectedCategory: (category) =>
    set({ selectedCategory: category, searchQuery: "" }),
}));

export default useProductStore;
