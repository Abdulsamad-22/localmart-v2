"use client";

import { useRouter } from "next/navigation";
import { ArrowClockwise, WifiSlash } from "@phosphor-icons/react";

export function ProductFetchError() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <WifiSlash size={28} className="text-gray-400" />
      </div>

      <h2 className="text-lg font-medium text-gray-900 mb-2">
        Could not load products
      </h2>
      <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8 leading-relaxed">
        This might be a network issue. Check your connection and try again — the
        market is still open.
      </p>

      <button
        onClick={() => router.refresh()}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#009688] hover:bg-[#00796B] text-white text-sm font-medium rounded-lg transition-all active:scale-95"
      >
        <ArrowClockwise size={16} />
        Try again
      </button>
    </div>
  );
}
