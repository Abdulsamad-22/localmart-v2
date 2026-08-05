"use client";

import { CaretDown } from "@phosphor-icons/react";
import { CategoryIcons } from "./CategoryIcons";
interface CategoryButtonProps {
  category: string;
  onClick: () => void;
}

export function CategoryButton({ category, onClick }: CategoryButtonProps) {
  const Icon = CategoryIcons[category] ?? CategoryIcons["All Categories"];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-11 w-full items-center justify-between rounded-xl
       border border-gray-200 bg-white pr-4 transition-all duration-200 hover:border-[#009688]
        active:scale-[0.98]"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-10.5 w-10 items-center justify-center bg-[#009688]/10 text-[#009688] rounded-[12px_0_0_12px]">
          <Icon size={18} weight="duotone" />
        </div>

        <span className="truncate text-sm font-medium text-gray-800">
          {category || "All Categories"}
        </span>
      </div>

      <CaretDown
        size={18}
        className="text-gray-400 transition-transform group-hover:translate-y-[1px]"
      />
    </button>
  );
}
