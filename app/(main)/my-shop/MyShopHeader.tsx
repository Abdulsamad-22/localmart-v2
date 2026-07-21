"use client";

import useAuthStore from "@/state-store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PencilSimple, ShareNetwork } from "@phosphor-icons/react";
import { VendorRow } from "@/types/vendor";
import { useState } from "react";

export default function MyShopHeader({ vendor }: { vendor: VendorRow }) {
  const { session, loading, vendorData } = useAuthStore();
  const router = useRouter();
  const [openOverlay, setOpenOverlay] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">Checking vendor status...</div>
      </div>
    );
  }

  // const shareUrl = `${window.location.origin}/vendor/${vendor?.id}`;

  const handleEditStore = (vendorData: VendorRow | null) => {
    router.push(`/vendor-registration?redirectTo${vendorData}`);
  };

  return (
    <div className="bg-[#009688]/8 rounded-lg py-6 mb-2 md:my-12 p-8 ">
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h1 className="text-[1.5rem] md:text-3xl font-bold text-gray-800 mb-[2px] md:mb-2">
            My Shop Dashboard
          </h1>
          <p className="text-gray-600 text-[0.875rem] md:text-[1rem]">
            Welcome back!
            {vendor?.businessName || vendor?.fullName || session?.user.email}!
          </p>
        </div>
        {/* Share Shop Section */}
        <div>
          <div className="flex gap-4 bg-gray-50 rounded-lg mb-8">
            <div>
              <button
                onClick={() => handleEditStore(vendorData)}
                className="flex items-center bg-[#009688]/10 text-sm text-[#009688] p-2 rounded-md gap-1"
              >
                <PencilSimple size={18} />{" "}
                <span className="hidden md:inline">Edit store</span>
              </button>
            </div>
            <button
              onClick={() => setOpenOverlay(!openOverlay)}
              className="flex items-center bg-[#009688] text-[#fff] p-2 rounded-md gap-1"
            >
              <ShareNetwork size={18} />
              <span className="hidden md:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      <Link
        href={`/vendor/${vendor?.id}`}
        className="text-cyan-600 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Public Shop
      </Link>

      {/* Dashboard Actions */}
      <div className="flex gap-2 md:gap-4 mt-3">
        <Link
          href={"/add-product"}
          className="flex-1 md:flex-none text-center bg-[#009688] text-[#fff] text-[0.875rem] md:text-[1rem] px-1 md:px-4 py-2 rounded"
        >
          Add New Product
        </Link>
        <Link
          href="/manage-products"
          className="flex-1 md:flex-none text-center bg-blue-500 text-[#fff] text-[0.875rem] md:text-[1rem] px-1 md:px-4 py-2 rounded"
        >
          Manage Products
        </Link>
        <Link
          href={"/orders"}
          className="flex-1 md:flex-none text-center bg-purple-600 text-[#fff] text-[0.875rem] md:text-[1rem] px-1 md:px-4 py-2 rounded hover:bg-purple-700"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
