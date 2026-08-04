"use client";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./AddProductProvider";
import { CurrencyNgn, Plus } from "@phosphor-icons/react";

export default function AddProductForm() {
  const [isFocused, setIsFocused] = useState(false);
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext<ProductFormData>();

  return (
    <div className="w-full md:w-[50%] md:p-6 rounded-lg">
      <h3 className="text-[1rem] md:text-[1.25rem] text-gray-900 font-medium mb-2">
        New Product
      </h3>
      <div className="bg-gray-50 px-4 py-6 rounded-[8px] border border-[#DEE4E1] space-y-6">
        <div className="space-y-2 text-gray-800 mb-6">
          <label className="block text-sm md:text-[1rem] font-medium text-gray-700 mb-1.5">
            Product Name
          </label>
          <input
            {...register("productName")}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009688]"
            type="text"
          />
          <p className="text-red-500 text-sm">{errors.productName?.message}</p>
        </div>

        <div className="space-y-2 text-gray-800 mb-6">
          <label className="block text-sm md:text-[1rem] font-medium text-gray-700 mb-1.5">
            Product Category
          </label>
          <input
            {...register("category")}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009688]"
            type="text"
          />
          <p className="text-red-500 text-sm">{errors.category?.message}</p>
        </div>

        <div className="space-y-2 text-gray-800 mb-6">
          <div className="flex items-center justify-between">
            <label className="block text-sm md:text-[1rem] font-medium text-gray-700 mb-1.5">
              Product Description
            </label>
          </div>

          <textarea
            {...register("description")}
            className="w-full h-[120px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009688]"
            placeholder="Briefly describe this product..."
          />
          <p className="text-red-500 text-sm">{errors.description?.message}</p>
        </div>

        <div className="space-y-2 text-gray-800">
          <label
            htmlFor="unit"
            className="block text-sm md:text-[1rem] font-medium text-gray-700 mb-1.5"
          >
            Units{" "}
            <span className="text-gray-400 pl-1">(No of item available)</span>
          </label>
          <input
            {...register("units")}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009688]"
            type="text"
          />
          <p className="text-red-500 text-sm">{errors.units?.message}</p>
        </div>

        <div className="w-full space-y-2 text-gray-800">
          <label
            htmlFor="price"
            className="block text-sm md:text-[1rem] font-medium text-gray-700 mb-1.5"
          >
            Pricing
          </label>

          <div
            className={`
        relative flex items-center border rounded-md transition-all duration-200
        ${
          isFocused
            ? "border-[#009688] ring-2 ring-[#009688]/20"
            : "border-gray-300"
        }
      `}
          >
            {/* Currency Icon Container */}
            <div
              className={`
            flex items-center justify-center py-3 px-2 w-12 h-full rounded-l-md transition-all duration-200
            ${isFocused ? "bg-[#009688]" : "bg-[#000]"}
          `}
            >
              <CurrencyNgn
                size={20}
                className={`
              transition-colors duration-200
              ${isFocused ? "text-white" : "text-[#fff]"}
            `}
              />
            </div>

            {/* Input Field */}
            <input
              {...register("price")}
              type="text"
              placeholder="0.00"
              className="
            flex-1 px-3 py-2 bg-transparent border-none rounded-r-md 
            focus:outline-none placeholder-gray-400
          "
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {errors.price?.message && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex-1 flex items-center gap-2 justify-center bg-[#009688] text-white px-2 py-3 rounded-lg hover:bg-[#00897B] mt-8"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </div>
    </div>
  );
}
