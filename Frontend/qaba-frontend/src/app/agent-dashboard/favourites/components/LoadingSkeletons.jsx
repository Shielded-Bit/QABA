'use client';

export const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    <div className="relative h-48 bg-gray-200">
      <div className="absolute top-3 left-3">
        <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
      </div>
      <div className="absolute top-3 right-3">
        <div className="h-8 w-8 bg-white rounded-full"></div>
      </div>
    </div>
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <PropertyCardSkeleton key={index} />
    ))}
  </div>
);

export const HeaderSkeleton = () => (
  <div className="mb-8 animate-pulse">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="h-8 bg-gray-200 rounded w-64"></div>
      <div className="w-full md:w-auto flex items-center gap-2">
        <div className="flex-grow md:w-80 h-10 bg-gray-200 rounded-full"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);
