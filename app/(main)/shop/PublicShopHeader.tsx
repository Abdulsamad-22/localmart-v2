import ShopDisplay from "@/src/components/shop/ShopDisplay";
import { VendorRow } from "@/types/vendor";

export default function PublicShopHeader({ vendor }: { vendor: VendorRow }) {
  return (
    <div className="py-8 my-10 md:my-12">
      {/* Public Shop Header */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-[0rem] md:mb-2">
          {vendor.businessName || vendor.fullName}
        </h1>
        {vendor.productCategory && (
          <p className="text-[0.875rem] md:text-[1rem] text-gray-600 max-w-2xl mx-auto">
            {vendor.productCategory}
          </p>
        )}
        {vendor.businessAddress && (
          <p className="text-gray-500 mt-2">📍 {vendor.businessAddress}</p>
        )}

        {/* Contact info if available */}
        <div className="flex justify-center gap-[0.5rem] md:gap-4 mt-4 text-sm text-gray-600">
          {vendor.phoneNumber && (
            <span className="flex items-center gap-2 text-[0.75rem] md:text-[1rem]">
              📞 {vendor.phoneNumber}
            </span>
          )}
          {vendor.email && <span>📧 {vendor.email}</span>}
        </div>
      </div>
    </div>
  );
}
