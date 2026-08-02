"use client";

import { useFormContext } from "react-hook-form";
import {
  Storefront,
  MapPin,
  InstagramLogo,
  TwitterLogo,
  TiktokLogo,
  FacebookLogo,
  Globe,
} from "@phosphor-icons/react";
import type { VendorFormData } from "@/types/vendor";

const PRODUCT_CATEGORIES = [
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
  "Other",
];

const STORE_TYPES = [
  {
    value: "physical",
    label: "Physical store",
    desc: "You have a physical location",
  },
  {
    value: "online",
    label: "Online only",
    desc: "You operate entirely online",
  },
  {
    value: "both",
    label: "Both",
    desc: "Physical location and online presence",
  },
];

const SOCIAL_PLATFORMS = [
  {
    key: "instagram",
    label: "Instagram",
    icon: InstagramLogo,
    prefix: "instagram.com/",
  },
  { key: "twitter", label: "Twitter / X", icon: TwitterLogo, prefix: "x.com/" },
  { key: "tiktok", label: "TikTok", icon: TiktokLogo, prefix: "tiktok.com/@" },
  {
    key: "facebook",
    label: "Facebook",
    icon: FacebookLogo,
    prefix: "facebook.com/",
  },
  { key: "website", label: "Website", icon: Globe, prefix: "https://" },
] as const;

export function StepBusinessInfo() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<VendorFormData>();
  const selectedStoreType = watch("storeType");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[1.125rem] font-medium text-gray-900 mb-0.5">
          Business Information
        </h2>
        <p className="text-sm text-gray-700">
          Help buyers understand what your store is about
        </p>
      </div>

      {/* business name */}
      <div>
        <label className="block text-[0.9375rem] font-medium text-gray-700 mb-1.5">
          Business name
        </label>
        <div className="relative">
          <Storefront
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            {...register("businessName")}
            type="text"
            placeholder="e.g. Amaka's Boutique"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent placeholder:text-gray-400"
          />
        </div>
        {errors.businessName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.businessName.message}
          </p>
        )}
      </div>

      {/* store type */}
      <div>
        <label className="block text-[0.9375rem] font-medium text-gray-700 mb-2">
          Store type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {STORE_TYPES.map((type) => {
            const isSelected = selectedStoreType === type.value;
            return (
              <label
                key={type.value}
                className={`flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    isSelected
                      ? "border-[#009688] bg-[#009688]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  value={type.value}
                  {...register("storeType")}
                  className="sr-only"
                />
                <span
                  className={`text-sm font-medium ${isSelected ? "text-[#009688]" : "text-gray-800"}`}
                >
                  {type.label}
                </span>
                <span className="text-[0.75rem] text-gray-600 mt-0.5">
                  {type.desc}
                </span>
              </label>
            );
          })}
        </div>
        {errors.storeType && (
          <p className="text-red-500 text-xs mt-1">
            {errors.storeType.message}
          </p>
        )}
      </div>

      {/* product category */}
      <div>
        <label className="block text-[0.9375rem] font-medium text-gray-700 mb-1.5">
          Product category
        </label>
        <select
          {...register("productCategory")}
          className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent text-gray-700"
        >
          <option value="">What will you sell?</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.productCategory && (
          <p className="text-red-500 text-xs mt-1">
            {errors.productCategory.message}
          </p>
        )}
      </div>

      {/* business address */}
      <div>
        <label className="block text-[0.9375rem] font-medium text-gray-700 mb-1.5">
          Business address
        </label>
        <p className="text-[0.75rem] text-gray-5600 mb-1.5">
          Use a neighbourhood-level address for better location matching e.g.
          Wuse 2, Abuja
        </p>
        <div className="relative">
          <MapPin
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            {...register("businessAddress")}
            type="text"
            placeholder="e.g. Ikeja, Lagos or Wuse 2, Abuja"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent placeholder:text-gray-400"
          />
        </div>
        {errors.businessAddress && (
          <p className="text-red-500 text-xs mt-1">
            {errors.businessAddress.message}
          </p>
        )}
      </div>

      {/* social handles */}
      <div>
        <label className="block text-[0.9375rem] font-medium text-gray-700 mb-1">
          Social media & website
          <span className="text-gray-500 font-normal ml-1">(optional)</span>
        </label>
        <p className="text-[0.75rem] text-gray-600 mb-3">
          Add your handles so buyers can find you online
        </p>
        <div className="space-y-2.5">
          {SOCIAL_PLATFORMS.map(({ key, label, icon: Icon, prefix }) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-gray-600" />
              </div>
              <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#009688] focus-within:border-transparent">
                <span className="px-2.5 py-3 text-xs text-gray-600 bg-gray-200 border-r border-gray-300 whitespace-nowrap">
                  {prefix}
                </span>
                <input
                  {...register(`socials.${key}` as any)}
                  type={key === "website" ? "url" : "text"}
                  placeholder={
                    key === "website"
                      ? "yourstore.com"
                      : `your${label.toLowerCase()}handle`
                  }
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
