export function ProductTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-10 w-10 rounded bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-3 w-1/4 rounded bg-gray-200" />
          </div>
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-4 w-12 rounded bg-gray-200" />
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-8 w-8 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
