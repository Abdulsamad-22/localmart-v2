import { create } from "zustand";
import { ProductsWithVendor } from "@/types/product";

type ProductStore = {
  products: ProductsWithVendor[];
  editingProduct: ProductsWithVendor | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setEditingProduct: (item: ProductsWithVendor | null) => void;
  setProducts: (item: ProductsWithVendor[]) => void;
  filteredProducts: () => ProductsWithVendor[];
};

const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  searchQuery: "",
  editingProduct: null,
  setProducts: (item) => set({ products: item }),
  setEditingProduct: (item) => set({ editingProduct: item }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  filteredProducts: () => {
    const { products, searchQuery } = get();

    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.item_name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query),
    );
  },
}));

export default useProductStore;
