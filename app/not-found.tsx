"use client";

import Link from "next/link";
import { House } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* number */}
      <p className="text-[clamp(5rem,18vw,9rem)] font-medium leading-none tracking-tighter mb-6">
        <span className="text-[#009688]">4</span>0
        <span className="text-[#009688]">4</span>
      </p>

      {/* stall illustration */}
      <div
        className="w-60 h-36 relative mb-8 animate-bounce"
        style={{ animationDuration: "3s" }}
      >
        {/* canopy */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-[#009688] rounded-t-md overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(255,255,255,0.12) 20px,rgba(255,255,255,0.12) 40px)",
            }}
          />
          {/* fringe */}
          <div
            className="absolute bottom-0 left-0 right-0 h-3 bg-[#007a6e]"
            style={{
              clipPath:
                "polygon(0 0,5% 100%,10% 0,15% 100%,20% 0,25% 100%,30% 0,35% 100%,40% 0,45% 100%,50% 0,55% 100%,60% 0,65% 100%,70% 0,75% 100%,80% 0,85% 100%,90% 0,95% 100%,100% 0)",
            }}
          />
        </div>

        {/* poles */}
        <div className="absolute left-6 top-0 w-2 h-full bg-[#5d4037] rounded" />
        <div className="absolute right-6 top-0 w-2 h-full bg-[#5d4037] rounded" />

        {/* shelf */}
        <div className="absolute top-16 left-9 right-9 h-5 bg-[#bcaaa4] rounded flex items-center justify-center">
          <span className="text-[10px] font-medium text-red-600 bg-white border border-gray-200 rounded px-2 py-0.5 whitespace-nowrap">
            Stall vacant
          </span>
        </div>

        {/* table */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#795548] rounded-b-md" />
        <div className="absolute bottom-8 left-8 w-1.5 h-7 bg-[#6d4c41]" />
        <div className="absolute bottom-8 right-8 w-1.5 h-7 bg-[#6d4c41]" />
      </div>

      {/* copy */}
      <h1 className="text-[clamp(1.1rem,3vw,1.4rem)] font-medium text-gray-900 mb-3">
        This stall has packed up and left.
      </h1>
      <p className="text-[0.9375rem] text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
        The page you're looking for doesn't exist — maybe the vendor moved, the
        link changed, or it was never here to begin with.{" "}
        <span className="text-gray-900 font-medium">
          The market's still open though.
        </span>
      </p>

      {/* actions */}
      <div className="flex flex-col items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#009688] hover:bg-[#00796B] text-white text-[0.9375rem] font-medium rounded-lg transition-all active:scale-95"
        >
          <House size={18} />
          Back to the market
        </Link>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-900 underline underline-offset-4 transition-colors"
        >
          Go back to where you were
        </button>
      </div>
    </div>
  );
}
