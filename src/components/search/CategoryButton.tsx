"use client";

import { CaretDown } from "@phosphor-icons/react";
import { CategoryIcons } from "./CategoryIcons";

interface CategoryButtonProps {
  category: string;
  open?: boolean;
  onClick: () => void;
}

export function CategoryButton({
  category,
  open,
  onClick,
}: CategoryButtonProps) {
  const label = category || "All Categories";
  const Icon = CategoryIcons[label] ?? CategoryIcons["All Categories"];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="category-sheet"
      className="group flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white pr-4 transition-all duration-200 hover:border-[#009688] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#009688]/15 active:scale-[0.98]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-[42px] w-10 shrink-0 items-center justify-center rounded-l-xl bg-[#009688]/10 text-[#009688]">
          <Icon size={18} weight="duotone" aria-hidden="true" />
        </div>

        <span className="truncate text-sm font-medium text-gray-800">
          {label}
        </span>
      </div>

      <CaretDown
        size={18}
        aria-hidden="true"
        className={`shrink-0 text-gray-400 transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
