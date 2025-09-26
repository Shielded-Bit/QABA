"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePropertiesCache } from '../../../contexts/PropertiesCacheContext';

const PropertiesBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [banners, setBanners] = useState([]);
  
  // Use the properties cache context
  const { properties, isLoading } = usePropertiesCache();

  // Process properties into banner format
  useEffect(() => {
    if (properties && properties.length > 0) {
      // Take the first 3 properties for the banner
      const bannerProperties = properties.slice(0, 3).map(property => ({
        id: property.id,
        image: property.images?.[0] || '/proper.png', // Use first image or fallback
        title: property.title || 'Property',
        location: `${property.city || 'Lagos'}, ${property.state || 'Lagos'}`,
        price: property.price ? `₦${property.price.toLocaleString()}` : 'Price on request',
        type: property.listing_type?.toLowerCase() || 'sale',
        period: property.listing_type?.toLowerCase() === 'rent' ? 'per month' : null
      }));
      
      setBanners(bannerProperties);
    }
  }, [properties]);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 4000); // Change banner every 4 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const handleClose = () => {
    setIsVisible(false);
  };

  // Don't show if loading, no banners, or user closed it
  if (isLoading || banners.length === 0 || !isVisible) return null;

  return (
    <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-4">
      <div className="relative w-full max-w-sm">
        {/* Banner Container */}
        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 h-[40px]">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-1 right-1 z-10 w-5 h-5 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Banner Content */}
          <div className="relative">
            {/* Property Showcase Banner */}
            <div className="flex items-center h-full">
              {/* Left Side - Property Image */}
              <div className="w-12 h-8 relative overflow-hidden rounded-l-xl">
                <Image
                  src={banners[currentBanner].image}
                  alt={banners[currentBanner].title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.src = '/proper.png'; // Fallback image
                  }}
                />
              </div>
              
              {/* Right Side - Property Info */}
              <div className="flex-1 px-3 py-1">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xs truncate text-gray-800">
                      {banners[currentBanner].title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {banners[currentBanner].location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className="text-xs font-bold text-[#014d98]">
                      {banners[currentBanner].price}
                      {banners[currentBanner].period && (
                        <span className="text-xs font-normal ml-1">
                          {banners[currentBanner].period}
                        </span>
                      )}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      banners[currentBanner].type === 'sale' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {banners[currentBanner].type === 'sale' ? 'Sale' : 'Rent'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Indicators */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentBanner ? 'bg-[#014d98]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesBanner;
