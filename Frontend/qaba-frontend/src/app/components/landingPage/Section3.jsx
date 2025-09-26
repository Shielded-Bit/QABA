'use client';

import React, { useState, useEffect } from 'react';
import { PropertyCardSkeleton } from '../../agent-dashboard/favourites/components/LoadingSkeletons';
import { useLandingPageCache } from '../../../contexts/LandingPageCacheContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Section3 = () => {
  // State for selected property
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Router for navigation
  const router = useRouter();

  // Use the landing page cache context
  const { 
    featuredProperties: properties, 
    isLoading: loading, 
    error, 
    initialized,
    getLandingPageData,
    clearCache,
    refreshData
  } = useLandingPageCache();



  // Fetch properties using the cache system
  useEffect(() => {
    // Only run if context is initialized
    if (!initialized) return;

    const fetchProperties = async () => {
      try {
        await getLandingPageData();
      } catch (err) {
        // Error handling is done by the context
      }
    };

    fetchProperties();
  }, [getLandingPageData, initialized]);

  // Set first property as selected when properties load
  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      setSelectedProperty(properties[0]);
    }
  }, [properties, selectedProperty]);


  return (
    <section id="section3-new" className="bg-gray-50 px-2 md:px-14 py-16">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent leading-tight">
          Best Properties Available
        </h2>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - Property cards skeleton */}
            <div className="space-y-3">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 h-24 lg:h-[141.5px] shadow-md">
                  <div className="flex h-full">
                    <div className="w-24 h-24 lg:w-44 lg:h-[141.5px] bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1 ml-4 space-y-2">
                      <div className="h-4 lg:h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      <div className="flex justify-between">
                        <div className="h-4 lg:h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Right side - Details skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
                </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-7xl mx-auto text-center text-red-500 mb-4">
          {error}
        </div>
      )}

      {/* Main Content - Split Layout */}
      {!loading && properties.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side - Property Cards */}
            <div className="space-y-3 md:col-span-1">
              {properties.slice(0, 5).map((property, index) => (
                <div
                  key={property.id}
                  onClick={() => {
                    // On mobile, navigate to details page; on desktop, select property
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      router.push(`/details/${property.id}`);
                    } else {
                      setSelectedProperty(property);
                    }
                  }}
                  className={`cursor-pointer transition-all duration-300 rounded-lg ${
                    selectedProperty?.id === property.id
                      ? 'ring-1 ring-[#014d98] shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="bg-white rounded-lg overflow-hidden h-32 md:h-24 lg:h-[141.5px] shadow-md relative">
                    {/* Tag positioned at top right */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                        property.listing_type?.toLowerCase() === 'sale'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}>
                        {property.listing_type_display || property.listing_type || 'Sale'}
                      </span>
                    </div>

                    <div className="flex h-full">
                      {/* Property Image */}
                      <div className="w-32 h-32 md:w-24 md:h-24 lg:w-44 lg:h-[141.5px] relative flex-shrink-0">
                        <Image
                          src={property.thumbnail && property.thumbnail.trim() !== '' ? property.thumbnail : '/proper.png'}
                          alt={property.property_name || 'Property'}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.target.src = '/proper.png';
                          }}
                        />
                      </div>

                      {/* Property Info */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1 truncate">
                            {property.property_name}
                          </h3>
                          <p className="text-gray-600 text-xs lg:text-sm truncate">
                            {property.city}, {property.state}
                          </p>
                          <p className="text-gray-500 text-xs truncate capitalize">
                            {property.property_type_display || property.property_type}
                          </p>
                        </div>
                        <div className="flex items-center justify-start">
                          <span className="text-[#014d98] font-bold text-sm lg:text-base">
                            ₦{(property.sale_price || property.rent_price)?.toLocaleString() || 'Price on request'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Property Details - Hidden on mobile */}
            <div className="hidden md:block bg-white rounded-xl p-6 shadow-lg">
              {selectedProperty ? (
                <div className="space-y-6">
                  {/* Property Image */}
                  <div className="relative h-64 w-full rounded-lg overflow-hidden">
                    <Image
                      src={selectedProperty.thumbnail && selectedProperty.thumbnail.trim() !== '' ? selectedProperty.thumbnail : '/proper.png'}
                      alt={selectedProperty.property_name || 'Property'}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = '/proper.png';
                      }}
                    />
                  </div>

                  {/* Property Details */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedProperty.property_name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {selectedProperty.location}
                    </p>
                    
                    {/* Price and Type */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-[#014d98]">
                        ₦{(selectedProperty.sale_price || selectedProperty.rent_price)?.toLocaleString() || 'Price on request'}
                        {selectedProperty.rent_price && (
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            /{selectedProperty.rent_frequency?.toLowerCase() || 'year'}
                          </span>
                        )}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                        selectedProperty.listing_type?.toLowerCase() === 'sale'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}>
                        {selectedProperty.listing_type_display || selectedProperty.listing_type || 'Sale'}
                      </span>
                    </div>

                    {/* Property Type */}
                    <div className="mb-4">
                      <span className="text-sm text-gray-600">Property Type: </span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedProperty.property_type_display || selectedProperty.property_type}
                      </span>
                    </div>

                    {/* Property Features */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <div className="text-lg font-semibold text-[#014d98]">
                          {selectedProperty.bedrooms !== undefined ? selectedProperty.bedrooms : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Bedrooms</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <div className="text-lg font-semibold text-[#014d98]">
                          {selectedProperty.bathrooms !== undefined ? selectedProperty.bathrooms : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                      </div>
                    </div>

                    {/* Amenities */}
                    {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProperty.amenities.slice(0, 6).map((amenity, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full border border-gray-300">
                              {amenity.icon} {amenity.name}
                            </span>
                          ))}
                          {selectedProperty.amenities.length > 6 && (
                            <span className="text-xs px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full border border-gray-300">
                              +{selectedProperty.amenities.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button - Hidden on mobile */}
                    <div className="hidden md:block">
                      <Link href={`/details/${selectedProperty.id}`}>
                        <button className="w-full bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#3ab7b1] hover:to-[#014d98] transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#014d98]">
                          View Full Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  Select a property to view details
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Section3;