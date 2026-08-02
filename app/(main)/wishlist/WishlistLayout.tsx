"use client";

import useCartStore from "@/state-store/cartStore";
import useWishlistStore from "@/state-store/wishlistStore";
import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Trash,
  Star,
  CurrencyNgn,
  Funnel,
  CaretDown,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function WishlistLayout() {
  const { removeFromWishlist, clearWishlist, wishlistItems } =
    useWishlistStore();
  const { addMultipleToCart, addToCart } = useCartStore();
  const [sortBy, setSortBy] = useState<string>("newest");

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.product.item_price - b.product.item_price;
      case "price-high":
        return b.product.item_price - a.product.item_price;
      case "name":
        return a.product.item_name.localeCompare(b.product.item_name);
      default:
        return wishlistItems.indexOf(b) - wishlistItems.indexOf(a);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-12 my-12">
      {/* Header */}
      <div className="bg-white border-b-[0.5px] border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[1.125rem] md:text-[1.5rem] font-semibold text-gray-900">
                My Wishlist
              </h1>
              <p className="text-[0.875rem] md:text-[1rem] text-gray-600 mt-1">
                {sortedItems.length} items saved
              </p>
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Funnel size={16} />
                <span className="text-sm font-medium">Filters</span>
              </button> */}

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-0 md:pr-8 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#009688]"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
                <CaretDown
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="">
        {sortedItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            {/* mobile size for heart will be 48*/}
            <Heart size={64} className="text-gray-300 mx-auto mb-[1px]" />
            <h2 className="text-[1rem] md:text-[1.25rem] font-semibold text-gray-900 mb-[1px]">
              Your wishlist is empty
            </h2>
            <p className="text-[0.875rem] md:text-[1rem] text-gray-600 mb-6">
              Save items you love to buy them later
            </p>
            <Link
              href={"/"}
              className="bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] px-6 py-[0.75rem] rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Items */
          <div className="bg-white">
            {sortedItems.map((item) => {
              // const vendor = vendors.find((v) => v.id === item.product.vendor_id);
              return (
                <div
                  key={item.product.id}
                  className="border-b-[1px] border-gray-200"
                >
                  <div className="p-4 sm:p-6">
                    <div className="mb-4 md:mb-0">
                      <div className="flex gap-4 mb-5 md:mb-0">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.image_url}
                            alt={item.product.item_name}
                            className="w-[7rem] sm:w-36 h-[6rem] sm:h-32 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                            <div className="flex-1">
                              {/* Product Name & Brand */}
                              <h3 className="text-[0.875rem] md:text-[1.125rem] font-medium text-gray-900 mb-2 md:mb-2 line-clamp-2">
                                {item.product.item_name}
                              </h3>
                              <p className="hidden md:block text-sm text-gray-600 mb-2">
                                {item.product.item_description}
                              </p>
                              {/* <div className="flex items-center gap-4 mb-3">
                              <span className="text-sm text-gray-500">
                                by {vendor.name}
                              </span>
                            </div> */}

                              {/* Rating & Reviews */}
                              <div className="hidden md:flex items-center gap-2 mb-2 md:mb-3">
                                <div className="flex items-center gap-[0.5px]">
                                  <Star
                                    weight="fill"
                                    className="text-yellow-400"
                                    size={20}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  4.5
                                </span>
                                <span className="text-sm text-gray-500">
                                  (120 reviews)
                                </span>
                              </div>

                              {/* Availability */}
                              <div className="flex items-center gap-2 mb-2 md:mb-4">
                                <span
                                  className={`inline-block w-2 h-2 rounded-full ${
                                    item.product.item_units > 0
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                ></span>
                                <span
                                  className={`text-sm ${
                                    item.product.item_units > 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {item.product.item_units > 0
                                    ? "In Stock"
                                    : "Out of Stock"}
                                </span>
                              </div>

                              <div className="block md:hidden text-right">
                                <div className="flex items-center text-[0.875rem] md:text-[1.25rem] text-gray-900">
                                  <CurrencyNgn
                                    className="text-[1rem] md:text-[1.5rem]
                                "
                                  />
                                  {Number(
                                    item.product.item_price,
                                  ).toLocaleString("en-NG")}
                                </div>
                              </div>
                            </div>

                            {/* Price & Actions */}
                            <div className="flex flex-col sm:items-end gap-4 sm:min-w-[200px]">
                              {/* Price */}
                              <div className="hidden md:block text-right">
                                <div className="flex items-center text-[0.875rem] md:text-[1.25rem] text-gray-900">
                                  <CurrencyNgn
                                    className="text-[1rem] md:text-[1.5rem]
                                "
                                  />
                                  {Number(
                                    item.product.item_price,
                                  ).toLocaleString("en-NG")}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="hidden md:flex flex-col gap-4 w-full sm:w-[9em]">
                                <button
                                  onClick={() => addToCart(item.product, 1)}
                                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] px-2 py-[0.5rem] rounded-lg transition-colors"
                                >
                                  <ShoppingCart size={18} />
                                  Add to Cart
                                </button>
                                <button
                                  onClick={() =>
                                    removeFromWishlist(item.product.id)
                                  }
                                  className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-2 py-[0.5rem] rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Trash size={18} />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile buttons */}
                      <div className="flex md:hidden gap-4 w-full">
                        <button
                          onClick={() => removeFromWishlist(item.product.id)}
                          className="flex flex-1 items-center justify-center gap-[4px] bg-white border border-gray-300 text-[0.875rem] md:text-[1rem] text-gray-700 px-2 py-[0.5rem] rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Trash size={16} />
                          Remove
                        </button>
                        <button
                          onClick={() => addToCart(item.product, 1)}
                          className="flex flex-1 items-center justify-center gap-[4px] bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[0.875rem] md:text-[1rem] text-[#fff] px-2 py-[0.5rem] rounded-lg transition-colors"
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bulk Actions Footer */}
        {sortedItems.length > 0 && (
          <div className="bg-white rounded-lg border border-[#DEE4E1] mt-6 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                {sortedItems.length} item
                {sortedItems.length !== 1 ? "s" : ""} in your wishlist
              </div>
              <div className="flex flex-row-reverse md:flex-row gap-3">
                <button
                  onClick={() =>
                    addMultipleToCart(wishlistItems.map((item) => item.product))
                  }
                  className="flex-1 md:flex-none bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] px-4 py-2 rounded-lg transition-colors"
                >
                  Add All to Cart
                </button>
                <button
                  onClick={() => clearWishlist()}
                  className="flex-1 md:flex-none bg-[#fff] border border-[#607d8b] text-[#607d8b] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
