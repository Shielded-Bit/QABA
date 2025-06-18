// PropertyCardSkeleton for dashboard property cards
import React from "react";

const PropertyCardSkeleton = () => (
  <div className="flex items-start gap-2 border-b pb-3 last:border-b-0 w-full animate-pulse">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200"></div>
    <div className="flex-1 min-w-0 space-y-1">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export { PropertyCardSkeleton };
