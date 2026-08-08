"use client";

import { useEffect } from "react";
import { X } from "@phosphor-icons/react";

import { CategoryList } from "./CategoryList";

interface CategorySheetProps {
  open: boolean;
  categories: string[];
  selectedCategory: string;
  onClose: () => void;
  onSelect: (category: string) => void;
}

export function CategorySheet({
  open,
  categories,
  selectedCategory,
  onClose,
  onSelect,
}: CategorySheetProps) {
  // Lock page scroll
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC key support
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 animate-in fade-in"
      />

      {/* Sheet */}
      <div
        className="
    fixed bottom-0 left-0 right-0 z-50 flex h-[70vh] flex-col overflow-hidden
    rounded-t-3xl bg-white shadow-2xl animate-in slide-in-from-bottom
    md:bottom-auto md:left-20 lg:left-30 md:top-[30rem] lg:top-[30rem] md:h-[80vh] md:w-[420px]
    md:-translate-x-12 md:-translate-y-1/2 md:rounded-3xl
  "
      >
        <div className="flex shrink-0 justify-center py-3">
          <div className="h-1.5 w-14 rounded-full bg-gray-300" />
        </div>

        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 pb-4">
          {/* header */}
        </div>

        <div className="min-h-0 flex-1">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={(category) => {
              onSelect(category);
              onClose();
            }}
          />
        </div>
      </div>
    </>
  );
}
