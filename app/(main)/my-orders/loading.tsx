export default function MyOrdersLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      {/* header skeleton */}
      <div className="mb-6">
        <div className="h-7 w-28 bg-gray-200 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-44 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* tabs skeleton */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {[40, 70, 80, 70, 70].map((w, i) => (
          <div key={i} className="px-4 py-3">
            <div
              className="h-4 bg-gray-200 rounded animate-pulse"
              style={{ width: `${w}px` }}
            />
          </div>
        ))}
      </div>

      {/* order cards skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            {/* order header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
            </div>

            {/* product image previews */}
            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse flex-shrink-0"
                />
              ))}
              <div className="ml-auto text-right space-y-1">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-8 bg-gray-100 rounded animate-pulse ml-auto" />
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between">
              <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
