"use client";

import useProductStore from "@/state-store/productStore";
import { ProductCard } from "../ProductCard";
import { ProductsWithVendor } from "@/types/product";
import { useState, useEffect } from "react";
import { SearchBar } from "../search/SearchBar";

type Props = {
  products: ProductsWithVendor[];
  limit: number;
};

const SEARCH_ALIASES: Record<string, string[]> = {
  shirt: ["shirt", "shirts", "tee", "tees", "top", "blouse"],
  tee: ["tee", "shirt", "top"],
  shoe: ["shoe", "shoes", "sneaker", "boot", "footwear", "trainer"],
  dress: ["dress", "gown", "frock"],
  bag: ["bag", "purse", "handbag", "clutch", "tote"],
  phone: ["phone", "mobile", "smartphone", "device"],
  food: ["food", "grocery", "produce", "snack", "drink"],
};

function expandQuery(query: string): string[] {
  const lower = query.toLowerCase();
  for (const [key, aliases] of Object.entries(SEARCH_ALIASES)) {
    if (aliases.includes(lower) || key === lower) {
      return aliases;
    }
  }
  return [lower];
}

function filterProducts(
  products: ProductsWithVendor[],
  searchQuery: string,
  selectedCategory: string,
): ProductsWithVendor[] {
  if (!searchQuery.trim() && !selectedCategory) return products;

  if (selectedCategory) {
    return products.filter((p) => p.item_category === selectedCategory);
  }

  const terms = expandQuery(searchQuery.toLowerCase().trim());

  return products.filter((p) =>
    terms.some(
      (term) =>
        p.item_name?.toLowerCase().includes(term) ||
        p.item_category?.toLowerCase().includes(term) ||
        p.vendor?.business_name?.toLowerCase().includes(term),
    ),
  );
}

export default function StoreGrid({ limit, products }: Props) {
  const setProducts = useProductStore((state) => state.setProducts);
  const allProducts = useProductStore((state) => state.products);
  const searchQuery = useProductStore((state) => state.searchQuery);
  const selectedCategory = useProductStore((state) => state.selectedCategory);

  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  // simulate brief loading state when filter changes
  useEffect(() => {
    if (!searchQuery && !selectedCategory) return;

    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const displayed = filterProducts(allProducts, searchQuery, selectedCategory);

  return (
    <main>
      <SearchBar />

      {isFiltering ? (
        // skeleton while filtering
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-4 gap-y-6 md:gap-y-12 px-4 md:px-12 my-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </section>
      ) : displayed.length === 0 ? (
        // empty state
        <div className="flex flex-col items-center justify-center py-24 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i
              className="ti ti-search text-gray-400 text-2xl"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-1 mb-1">
            <p className="text-sm font-medium text-gray-900">
              No products found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try searching with another keyword.
            </p>
          </div>

          <p className="text-sm text-gray-500 text-center">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search.`
              : `No products in ${selectedCategory} yet.`}
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-4 gap-y-6 md:gap-y-12 px-4 md:px-12 my-12">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#DEE4E1] rounded-[4px] md:rounded-[10px]">
      <div className="w-full aspect-[3/4] md:aspect-auto md:h-[218px] bg-gray-200 animate-pulse rounded-t-[4px] md:rounded-t-[10px]" />
      <div className="px-3 py-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
        <div className="hidden md:block h-4 bg-gray-100 rounded animate-pulse w-3/5" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/5" />
        <div className="hidden md:block h-9 bg-gray-200 rounded-[8px] animate-pulse mt-2" />
      </div>
    </div>
  );
}
