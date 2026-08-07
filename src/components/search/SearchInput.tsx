"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;

  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export function SearchInput({
  value,
  placeholder = "Search products, vendors, categories...",
  disabled = false,
  loading = false,
  onChange,
  onSubmit,
  onClear,
}: SearchInputProps) {
  return (
    <div
      className="flex h-12 w-full items-center rounded-xl border border-gray-200
     bg-white transition-all duration-200 focus-within:border-[#009688]
      focus-within:ring-4 focus-within:ring-[#009688]/10"
    >
      {/* Search Icon */}

      {/* <MagnifyingGlass
        size={19}
        weight="duotone"
        className="ml-4 text-gray-400 flex-shrink-0"
      /> */}

      {/* Input */}

      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />

      {/* Clear */}

      <button
        type="button"
        onClick={onClear}
        className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
          value.trim()
            ? "opacity-100 scale-100 hover:bg-gray-100"
            : "pointer-events-none opacity-0 scale-75"
        }`}
      >
        <X size={16} weight="bold" className="text-gray-500" />
      </button>

      {/* Search Button */}

      <button
        type="button"
        disabled={disabled || loading}
        onClick={onSubmit}
        className="mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#009688] text-white transition-all duration-200 hover:bg-[#00796B] activate:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MagnifyingGlass size={18} weight="bold" />
      </button>
    </div>
  );
}
