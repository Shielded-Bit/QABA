// PropertyDetailsSkeleton.jsx
import React from "react";

const PropertyDetailsSkeleton = () => (
  <div className="bg-slate-50 min-h-screen animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
    </div>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Location */}
      <div className="mb-8">
        <div className="h-10 w-2/3 bg-gray-200 rounded mb-2"></div>
        <div className="h-6 w-1/3 bg-gray-100 rounded mb-4"></div>
        <div className="flex gap-2">
          <div className="h-5 w-24 bg-gray-100 rounded"></div>
          <div className="h-5 w-16 bg-gray-100 rounded"></div>
        </div>
      </div>
      {/* Image Gallery */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-1/2">
            <div className="relative h-60 sm:h-96 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="hidden sm:block w-full sm:w-1/2">
            <div className="relative h-60 sm:h-96 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="bg-gray-200 p-3 rounded-full w-10 h-10"></div>
          <div className="flex gap-2 items-center overflow-x-auto max-w-lg">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 p-3 rounded-full w-10 h-10"></div>
        </div>
      </section>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 w-24 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 w-full bg-gray-100 rounded"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-40 w-full bg-gray-100 rounded"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="h-10 w-full bg-gray-100 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
      {/* Reviews & Comments */}
      <section className="mt-12">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
        </div>
      </section>
      <section className="mt-12">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
        </div>
      </section>
      {/* Similar Properties */}
      <section className="mt-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 w-1/2 bg-gray-100 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default PropertyDetailsSkeleton;
