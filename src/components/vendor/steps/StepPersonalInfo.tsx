"use client";

import { useFormContext } from "react-hook-form";
import { User, Envelope, Phone } from "@phosphor-icons/react";
import type { VendorFormData } from "@/types/vendor";
import { VendorLogoUpload } from "../VendorLogoUpload";

type Props = {
  logo: File | null;
  setLogo: (file: File | null) => void;
};

export function StepPersonalInfo({ logo, setLogo }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<VendorFormData>();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[1.125rem] font-medium text-gray-900 dark:text-white mb-0.5">
          Personal Information
        </h2>
        <p className="text-[0.75rem] text-gray-400">
          This information is used to identify your account
        </p>
      </div>

      {/* logo upload */}
      <VendorLogoUpload logo={logo} setLogo={setLogo} />

      {/* full name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Full name
        </label>
        <div className="relative">
          <User
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            {...register("fullName")}
            type="text"
            placeholder="Abdulsamad Hussaini"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent dark:bg-gray-800 dark:text-white placeholder:text-gray-400"
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Email address
        </label>
        <div className="relative">
          <Envelope
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent dark:bg-gray-800 dark:text-white placeholder:text-gray-400"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Phone number
        </label>
        <div className="relative">
          <Phone
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            {...register("phoneNumber")}
            type="tel"
            placeholder="+234 801 234 5678"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent dark:bg-gray-800 dark:text-white placeholder:text-gray-400"
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-red-500 text-xs mt-1">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>
    </div>
  );
}
