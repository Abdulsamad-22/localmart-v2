"use client";

import { getProducts } from "@/lib/products/getProducts";
import useProductStore from "@/state-store/productStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SearchBar() {
  const { register } = useForm();
  const { setProducts } = useProductStore();

  useEffect(() => {
    async function fetchAllProducts() {
      const result = await getProducts();

      if (!result.success) {
        console.log(result.message);
        return;
      }

      setProducts(result.data);
    }

    fetchAllProducts();
  }, []);

  return (
    <div className="bg-[#009688] sticky top-[4rem] md:top-20 grid grid-cols-[80%_18%] md:grid-cols-[49.36%_49.36%] gap-4 py-5 md:py-6 px-4 md:px-12 w-full mt-[2rem] z-[1]">
      <div className="rounded-2xl">
        <input
          {...register("search")}
          className="w-full bg-[#fff] py-2 px-4 md:px-6 border-none outline-none rounded-lg"
          placeholder="Search for products, vendors and categories..."
          type="text"
        />
      </div>

      <div className="w-full gap-4 flex">
        <select className="w-full md:w-[50%] py-2 px-4 outline-none rounded-lg">
          <option value="categories">Choose category</option>
          <option value="categories">Groceries</option>
        </select>

        <select className="hidden md:inline w-[50%] py-2 px-4 outline-none rounded-lg">
          <option value="categories">Filter</option>
          <option value="categories">Groceries</option>
        </select>
      </div>
    </div>
  );
}
