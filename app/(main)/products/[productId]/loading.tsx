export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 md:my-12">
      <div className="px-4 md:px-6 sm:px-6 lg:px-12 py-6">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-20 mb-12">
          {/* image skeleton */}
          <div className="w-full md:w-1/2 bg-gray-200 rounded-lg animate-pulse md:h-[450px] aspect-square" />

          {/* product info skeleton */}
          <div className="w-full md:w-1/2 space-y-6">
            {/* category + name + price */}
            <div>
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="flex justify-between border-b border-dashed border-gray-200 py-2 mb-4">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-12 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>

            {/* description */}
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-3/5 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>

            {/* sizes */}
            <div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse" />
            </div>

            {/* colors */}
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-16 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* stock status */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* quantity + action buttons */}
            <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
              {/* quantity */}
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                  <div className="w-14 h-8 bg-gray-100 rounded animate-pulse" />
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                </div>
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
              </div>

              {/* add to cart + buy now */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 h-12 bg-gray-100 rounded-lg animate-pulse" />
              </div>

              {/* wishlist + share */}
              <div className="flex items-center justify-center gap-6">
                <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>

            {/* delivery & services */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-gray-200 animate-pulse flex-shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* seller info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
