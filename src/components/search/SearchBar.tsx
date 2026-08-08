"use client";

import { useForm } from "react-hook-form";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import useProductStore from "@/state-store/productStore";
import { SearchInput } from "./SearchInput";
import { useState, useEffect } from "react";
import { CategorySheet } from "./CategorySheet";
import { CategoryButton } from "./CategoryButton";

const PRODUCT_CATEGORIES = [
  "All Categories",
  "Fashion & Clothing",
  "Food & Groceries",
  "Electronics",
  "Beauty & Personal Care",
  "Home & Furniture",
  "Health & Wellness",
  "Sports & Fitness",
  "Books & Stationery",
  "Baby & Kids",
  "Phones & Accessories",
  "Agriculture & Farm Produce",
  "Art & Crafts",
  "Others",
];

type SearchForm = {
  search: string;
  category: string;
};

export function SearchBar() {
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);
  const setSelectedCategory = useProductStore(
    (state) => state.setSelectedCategory,
  );
  const searchQuery = useProductStore((state) => state.searchQuery);
  const selectedCategory = useProductStore((state) => state.selectedCategory);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<SearchForm>({
      defaultValues: { search: "", category: "" },
    });

  const searchValue = watch("search");

  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    if (searchValue.trim() === "" && searchQuery !== "") {
      setSearchQuery("");
    }
  }, [searchValue, searchQuery, setSearchQuery]);

  // search button clicked — update store, grid reacts
  const onSubmit = (data: SearchForm) => {
    setSearchQuery(data.search.trim());
  };

  const submitSearch = handleSubmit(onSubmit);

  return (
    <div className="sticky top-[3.5rem] md:top-[4.5rem] z-10 bg-white border-b border-gray-100 px-4 md:px-12 py-3">
      <form onSubmit={submitSearch} className="max-w-4xl mx-auto">
        {/* Desktop */}

        <div className="hidden md:flex gap-3">
          <div className="w-64">
            <CategoryButton
              category={selectedCategory || "All Categories"}
              onClick={() => setCategoryOpen(true)}
            />
          </div>

          <SearchInput
            value={searchValue}
            onChange={(value) => setValue("search", value)}
            onSubmit={submitSearch}
            onClear={() => setValue("search", "")}
          />
        </div>

        {/* Mobile */}

        <div className="flex flex-col gap-3 md:hidden">
          <SearchInput
            value={searchValue}
            onChange={(value) => setValue("search", value)}
            onSubmit={submitSearch}
            onClear={() => setValue("search", "")}
          />

          <CategoryButton
            category={selectedCategory || "All Categories"}
            onClick={() => setCategoryOpen(true)}
          />
        </div>
      </form>

      <CategorySheet
        open={categoryOpen}
        categories={PRODUCT_CATEGORIES}
        selectedCategory={selectedCategory}
        onClose={() => setCategoryOpen(false)}
        onSelect={(category) =>
          setSelectedCategory(category === "All Categories" ? "" : category)
        }
      />
    </div>
  );
}
