export default function BuyerOrderDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
      {/* back + header */}
      <div>
        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="space-y-2">
            <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* vendor group skeleton — 2 vendors */}
      {Array.from({ length: 2 }).map((_, v) => (
        <div
          key={v}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* vendor header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* items */}
          {Array.from({ length: v === 0 ? 2 : 1 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 border-b last:border-0 border-gray-100"
            >
              <div className="w-14 h-14 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* delivery info skeleton */}
      <div className="bg-white  rounded-xl border border-gray-200 p-5">
        <div className="h-4 w-36 bg-gray-200  rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between gap-4">
              <div className="h-4 w-20 bg-gray-100  rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-200  rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* payment summary skeleton */}
      <div className="bg-white  rounded-xl border border-gray-200 p-5">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`flex justify-between ${i === 2 ? "pt-2 border-t border-gray-100" : ""}`}
            >
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* payment reference skeleton */}
      <div className="bg-gray-50 /50 rounded-xl border border-gray-200 p-4">
        <div className="h-3 w-28 bg-gray-100 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
