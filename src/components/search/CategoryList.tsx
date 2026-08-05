"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

import { CategoryItem } from "./CategoryItem";

interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryList({
  categories,
  selectedCategory,
  onSelect,
}: CategoryListProps) {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;

    return categories.filter((category) =>
      category.toLowerCase().includes(search.toLowerCase()),
    );
  }, [categories, search]);

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="sticky top-0 z-10 bg-white px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center h-11 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#009688] focus-within:ring-2 focus-within:ring-[#009688]/20 transition-all">
          <MagnifyingGlass
            size={18}
            className="ml-4 text-gray-400 flex-shrink-0"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="flex-1 bg-transparent px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mr-3 rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {filteredCategories.length > 0 ? (
          <div className="space-y-1">
            {filteredCategories.map((category) => (
              <CategoryItem
                key={category}
                category={category}
                selected={selectedCategory === category}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-56 flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-full bg-gray-100 p-4">
              <MagnifyingGlass size={28} className="text-gray-400" />
            </div>

            <p className="text-sm font-medium text-gray-700">
              No categories found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try searching with another keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
