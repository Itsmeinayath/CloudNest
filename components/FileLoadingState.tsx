"use client";

// A "skeleton" loading component to provide a better user experience.
export default function FileLoadingState() {
  return (
    <div className="space-y-2 animate-pulse">
      {/* Create an array of 8 items to map over for the skeleton */}
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg"
        >
          <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gray-600/50 rounded flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-600/50 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-600/30 rounded w-1/2"></div>
          </div>
          <div className="w-4 h-4 bg-gray-600/30 rounded"></div>
        </div>
      ))}
    </div>
  );
}
