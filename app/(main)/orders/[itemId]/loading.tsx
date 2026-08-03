export default function OrderDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
      {/* back + header */}
      <div>
        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-7 w-24 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>

      {/* status timeline skeleton */}
      <div className="bg-white rounded-xl border border-gray-200  p-5">
        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="flex items-center justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-3 w-14 bg-gray-100 rounded animate-pulse" />
              </div>
              {i < 3 && (
                <div className="flex-1 h-0.5 mx-2 mb-5 bg-gray-200 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* product card skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* delivery info skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* buyer contact skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* update button skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-3 w-64 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
