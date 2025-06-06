'use client';

export const PropertyCardSkeleton = () => (
  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 w-11/12 sm:w-full max-w-xs shrink-0 animate-pulse">
    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
      <div className="absolute top-3 left-3">
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
      </div>
      <div className="absolute top-3 right-3">
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
    <div className="mt-3 space-y-2">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

export const PropertySectionSkeleton = () => (
  <div className="mb-12">
    <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

export const SearchFilterSkeleton = () => (
  <div className="mb-6 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
      <div className="relative flex-grow mb-4 md:mb-0">
        <div className="w-[100%] md:w-[50%] sm:w-[100%] h-10 bg-gray-200 rounded-md"></div>
      </div>
      <div className="w-24 h-10 bg-gray-200 rounded-md"></div>
    </div>
  </div>
);
