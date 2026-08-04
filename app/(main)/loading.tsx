export default function StoreFrontLoading() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-4 gap-y-6 md:gap-y-12 px-4 md:px-12 my-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </section>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#DEE4E1] rounded-[4px] md:rounded-[10px]">
      {/* image */}
      <div className="w-full h-[11rem] md:h-[218px] bg-gray-200 animate-pulse rounded-t-[4px] md:rounded-t-[10px]" />

      {/* content */}
      <div className="px-3 py-3 space-y-[6px] md:space-y-3">
        {/* product name */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />

        <div className="space-y-2 md:space-y-4">
          {/* vendor name — desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5" />
          </div>

          {/* rating — desktop only */}
          <div className="hidden md:flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="space-y-[3px] md:space-y-2">
            {/* price */}
            <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-2/5" />

            {/* distance + mobile cart button */}
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
              <div className="md:hidden h-7 w-9 bg-gray-200 rounded-[16px] animate-pulse" />
            </div>
          </div>
        </div>

        {/* add to cart button — desktop only */}
        <div className="hidden md:block h-9 bg-gray-200 rounded-[8px] animate-pulse mt-2 md:mt-4" />
      </div>
    </div>
  );
}
