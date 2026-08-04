"use client";

import { useState, useRef, useEffect } from "react";
import { ShareNetwork, Copy, Check, X } from "@phosphor-icons/react";
import {
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  XIcon,
  TelegramShareButton,
  TelegramIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";

type Props = {
  vendorId: string;
  shopName: string;
};

export function ShareButton({ vendorId, shopName }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shop/${vendorId}`;
  const title = `Check out ${shopName} on LocalMart`;

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async () => {
    // use native share sheet on mobile if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: shopName,
          text: title,
          url: shareUrl,
        });
      } catch (err) {
        // user cancelled the share sheet — do nothing
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Share failed:", err.message);
        }
      }
      return;
    }

    // fall back to dropdown on desktop
    setOpen((prev) => !prev);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* trigger button */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium px-3.5 py-2 rounded-lg bg-[#607d8b] hover:bg-[#00796B] text-[#fff] transition-all"
      >
        <ShareNetwork size={15} />
        Share
      </button>

      {/* desktop dropdown — only shows when native share unavailable */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Share your store
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={14} />
            </button>
          </div>

          <div className="p-3 space-y-1">
            <WhatsappShareButton
              url={shareUrl}
              title={title}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full">
                <WhatsappIcon size={28} round />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  WhatsApp
                </span>
              </div>
            </WhatsappShareButton>

            <TelegramShareButton
              url={shareUrl}
              title={title}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full">
                <TelegramIcon size={28} round />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Telegram
                </span>
              </div>
            </TelegramShareButton>

            <TwitterShareButton
              url={shareUrl}
              title={title}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full">
                <XIcon size={28} round />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Twitter / X
                </span>
              </div>
            </TwitterShareButton>

            <FacebookShareButton
              url={shareUrl}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full">
                <FacebookIcon size={28} round />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Facebook
                </span>
              </div>
            </FacebookShareButton>
          </div>

          <div className="px-3 pb-3">
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={18} className="text-[#009688]" />
                  <span className="text-sm text-[#009688] font-medium">
                    Link copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Copy link
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
