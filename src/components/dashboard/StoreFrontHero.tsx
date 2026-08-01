"use client";

import { SealCheck } from "@phosphor-icons/react";

import { StoreAvatar, StoreBadge, StoreCover } from "../storeFront";

import { Vendor } from "@/types/vendor";
import { ProductsWithVendor } from "@/types/product";
import { StoreAction } from "./DashboardActions";
import { StoreStatusBadge } from "./StoreStatusBadge";
import { StoreStats } from "./StoreStats";
import { ShareButton } from "../shop/ShareStoreUrl";

interface Props {
  vendor: Vendor;
  products: ProductsWithVendor[];
  pendingOrders: number;
}

export function StorefrontHero({ vendor, products, pendingOrders }: Props) {
  const name = vendor.business_name || vendor.full_name;

  return (
    <section className="mb-16">
      {/* Cover */}
      <StoreCover image={vendor.cover_url} />

      {/* Card */}
      <div className="relative mx-auto -mt-14 w-[94%] max-w-6xl rounded-3xl border bg-white p-8 shadow-xl">
        {/* Avatar */}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="-mt-20">
              <StoreAvatar vendor={vendor} />
            </div>

            <div>
              {/* Business Name */}
              <StoreStatusBadge active={vendor.active ?? true} />

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
                  {name}
                </h1>

                {vendor.verified && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                    <SealCheck size={18} weight="fill" />
                    Verified Seller
                  </div>
                )}
              </div>

              {/* Category */}

              {vendor.product_category && (
                <div className="mt-5">
                  <StoreBadge>{vendor.product_category}</StoreBadge>
                </div>
              )}

              {/* Description */}

              <p className="mt-5 max-w-2xl leading-7 text-slate-600">
                Browse quality products from{" "}
                <span className="font-semibold">{name}</span>. Fast response,
                secure checkout, and reliable delivery.
              </p>

              {/* Contact */}

              <div className="mt-8 flex flex-wrap gap-3">
                <StoreAction pendingOrders={pendingOrders} />
              </div>
            </div>
          </div>

          <ShareButton
            vendorId={vendor.id}
            shopName={vendor.business_name ?? ""}
          />
        </div>

        <StoreStats
          totalProducts={products.length}
          rating={vendor.average_rating}
        />
      </div>
    </section>
  );
}
