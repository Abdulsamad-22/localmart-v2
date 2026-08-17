"use client";
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ProductFormData } from "./AddProductProvider";
import { CurrencyNgn, Plus } from "@phosphor-icons/react";

export default function AddProductForm() {
  const [isFocused, setIsFocused] = useState(false);
  const {
    register,
    formState: { isSubmitting, errors },
    control,
  } = useFormContext<ProductFormData>();

  const formatPrice = (value: string) => {
    // Keep digits and one decimal point only
    const clean = value.replace(/,/g, "").replace(/[^\d.]/g, "");
    const [whole = "", ...decimalParts] = clean.split(".");
    const decimal = decimalParts.join("");

    const formattedWhole = whole ? Number(whole).toLocaleString("en-NG") : "";

    // Preserve a typed decimal point, e.g. "1,000."
    return clean.includes(".")
      ? `${formattedWhole}.${decimal}`
      : formattedWhole;
  };

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Price
            </label>
            <div className="relative">
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 
            flex items-center justify-center py-3 px-2 w-12 h-full rounded-l-md transition-all duration-200
            ${isFocused ? "bg-[#009688]" : "bg-gray-500"}
          `}
              >
                <CurrencyNgn
                  size={16}
                  className={`
              transition-colors duration-200
              ${isFocused ? "text-white" : "text-[#fff]"}
            `}
                />
              </div>
              <Controller
                name="price"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={formatPrice(field.value ?? "")}
                    className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688]"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(event) => {
                      // Store only digits and decimal point in form state/database payload
                      const rawValue = event.target.value
                        .replace(/,/g, "")
                        .replace(/[^\d.]/g, "");

                      field.onChange(rawValue);
                    }}
                  />
                )}
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Stock units
            </label>
            <input
              {...register("units")}
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688]"
            />
            {errors.units && (
              <p className="text-red-500 text-xs mt-1">
                {errors.units.message}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex-1 flex items-center gap-2 justify-center bg-[#009688] text-white px-2 py-3 rounded-lg hover:bg-[#00897B] mt-8"
        >
          <Plus size={20} />

          {isSubmitting ? (
            <>
              <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
              Adding product...
            </>
          ) : (
            "Add product"
          )}
        </button>
      </div>
    </div>
  );
}
