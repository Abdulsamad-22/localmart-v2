"use client";

import { Check } from "@phosphor-icons/react";
import { CategoryIcons } from "./CategoryIcons";

interface CategoryItemProps {
  category: string;
  selected: boolean;
  onSelect: (category: string) => void;
}

export function CategoryItem({
  category,
  selected,
  onSelect,
}: CategoryItemProps) {
  const Icon = CategoryIcons[category] ?? CategoryIcons["All Categories"];

  return (
    <button
      type="button"
      onClick={() => onSelect(category)}
      className={`group flex w-full items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 ${selected ? "bg-[#009688]/10" : "hover:bg-gray-50 active:bg-gray-100"}`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
            selected
              ? "bg-[#009688] text-white"
              : "bg-gray-100 text-gray-600 group-hover:bg-[#009688]/10 group-hover:text-[#009688]"
          }`}
        >
          <Icon size={20} weight="duotone" />
        </div>

        <span
          className={`truncate text-sm font-medium ${selected ? "text-[#009688]" : "text-gray-800"}`}
        >
          {category}
        </span>
      </div>

      <div
        className={`transition-all duration-200 ${selected ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      >
        <Check size={20} weight="bold" className="text-[#009688]" />
      </div>
    </button>
  );
}
