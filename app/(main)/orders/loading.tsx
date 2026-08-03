export default function OrdersLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* header skeleton */}
      <div className="mb-6">
        <div className="h-7 w-24 bg-gray-200 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* tabs skeleton */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {[80, 60, 90, 70, 80].map((w, i) => (
          <div key={i} className="px-4 py-3">
            <div
              className="h-4 bg-gray-200 rounded animate-pulse"
              style={{ width: `${w}px` }}
            />
          </div>
        ))}
      </div>

      {/* order rows skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white"
          >
            {/* unread dot */}
            <div className="w-2 flex-shrink-0" />

            {/* product image */}
            <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />

            {/* order info */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
            </div>

            {/* amount + status */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
            </div>

            {/* chevron */}
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
