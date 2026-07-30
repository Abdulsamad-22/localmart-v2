"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import {
  createVendorRecord,
  vendorSchema,
  type VendorFormData,
} from "@/lib/vendors/createVendorRecord";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../../../styles/RadioButton.css";
import { toast } from "sonner";

export default function VendorRegistrationForm() {
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<VendorFormData>({ resolver: yupResolver(vendorSchema) });

  const selectedStoreType = useWatch({
    control,
    name: "storeType",
  });

  const placeholder =
    selectedStoreType === "online"
      ? "Enter reference address (e.g house address)"
      : selectedStoreType
        ? "Enter store address"
        : "Business Address";

  async function onSubmit(formData: VendorFormData) {
    setIsLoading(true);
    try {
      const result = await createVendorRecord(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Registration successful! Your payment account is ready.");
      router.replace("/my-shop");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      reset();
      setIsLoading(false);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center px-6 my-12">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-[#1f2937]">
          Vendor Registration
        </h2>
        <p className="text-gray-700 text-sm">
          Register your business and start selling on LocalMart Now!!
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        noValidate
        className="w-full md:w-full"
      >
        {/* Personal Information */}

        <div className="mb-4 rounded-[10px] bg-white p-6 shadow">
          <div className="flex items-start gap-2 mb-6">
            {/* <User size={24} /> */}
            <div>
              <h2 className="font-semibold my-0 py-0">Personal Information</h2>
              <p className="text-sm text-gray-400 my-0 py-0">
                Tell us about yourself
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                {...register("fullName", {
                  required: "Full name is required",
                })}
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.fullName?.message}</p>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                id="email"
                type="email"
                placeholder="johndoe@email.com"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
                id="phone"
                type="tel"
                placeholder="+234 801 234 5678"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">
                {errors.phoneNumber?.message}
              </p>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="mb-4 rounded-[10px] bg-white p-6 shadow">
          <div className="flex items-start gap-2 mb-6">
            {/* <Storefront size={24} /> */}
            <div>
              <h3 className="font-semibold my-0 py-0">Business Information</h3>
              <p className="text-sm text-gray-400 my-0 py-0">
                Details about your business
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                {...register("businessName", {
                  required: "Business name is required",
                })}
                placeholder="Business Name"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">
                {errors.businessName?.message}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <select
                {...register("businessType")}
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              >
                <option value="">Select Business Type</option>
                <option value="individual">Individual</option>
                <option value="registered">Registered Business</option>
                <option value="company">Company</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Business Category
              </label>
              <input
                {...register("productCategory")}
                placeholder="What will you sell?"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Social Link
              </label>
              <input
                {...register("socials")}
                placeholder="Website or Social Link (Optional)"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Type
              </label>
              <div className="flex gap-6">
                {[
                  { value: "physical", label: "Physical Store" },
                  { value: "online", label: "Online Store" },
                  { value: "both", label: "Both" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...register("storeType")}
                      className="custom-radio"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <input
                {...register("businessAddress")}
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Business policies */}
        <div className="bg-white mb-4 rounded-[10px] p-6 shadow">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              {/* <ShieldCheck size={24} /> */}
              <h4 className="text-lg font-semibold text-gray-800">
                Business Policies
              </h4>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Return Policy Duration
              </label>
              <select
                {...register("returnPolicy")}
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg"
              >
                <option value="">Select Return Policy</option>
                <option value="3">3 days return</option>
                <option value="7">7 days return</option>
                <option value="14">14 days return</option>
                <option value="30">30 days return</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Specify how many days customers have to return a product.
              </p>
              <p className="text-red-500 text-sm">
                {errors.returnPolicy?.message}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Average Delivery Duration
              </label>
              <input
                {...register("deliveryDuration")}
                placeholder="e.g. 3–5 business days"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              />
              <p className="text-sm text-gray-500 mt-1">
                Estimated number of days required to deliver an order.
              </p>
              <p className="text-red-500 text-sm">
                {errors.deliveryDuration?.message}
              </p>
            </div>
          </div>
        </div>

        {/* Bank account Information */}
        <div className="p-6 shadow rounded-[10px] bg-white">
          <div className="flex items-start gap-2 mb-6">
            {/* <CreditCard size={24} /> */}
            <div>
              <h2 className="font-semibold my-0 py-0">Bank Details</h2>
              <p className="text-sm text-gray-400 my-0 py-0">
                Details about your payment account
              </p>
            </div>
          </div>
          <div className="md:col-span-2 gap-6 mb-8">
            <div>
              <label
                htmlFor="bank-name"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Bank Name
              </label>
              <input
                {...register("bankName")}
                placeholder="Bank Name"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.bankName?.message}</p>
            </div>

            <div>
              <label
                htmlFor="account-number"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Account number
              </label>
              <input
                {...register("accountNumber")}
                placeholder="Account Number"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009688] rounded-lg placeholder:text-gray-400"
              />
              <p className="text-red-500 text-sm">
                {errors.accountNumber?.message}
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={isSubmitting}
            className={`bg-gradient-to-r from-[#009688] to-[#00695C] text-white px-6 py-3 rounded font-semibold ${
              isSubmitting
                ? "flex items-center gap-2 opacity-70 cursor-not-allowed"
                : "hover:from-[#00897B] hover:to-[#005B4F]"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
