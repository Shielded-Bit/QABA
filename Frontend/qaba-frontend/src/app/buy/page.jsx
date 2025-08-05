'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ListingCard from '../components/listingCard/ListingCard';
import Button from '../components/shared/Button';
import { IoMdArrowDropdown } from "react-icons/io";
import { VscClearAll } from "react-icons/vsc";
import { PropertyCardSkeleton } from '../agent-dashboard/favourites/components/LoadingSkeletons';
import { useSearchParams } from 'next/navigation';
import { propertyLocationIndex } from "../utils/propertyLocationIndex";

function BuyContent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleListings, setVisibleListings] = useState(6);
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    price_range: '',
    property_status: '',
    lister_type: ''
  });

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  // Function to extract and format price from property data
  const extractPrice = (property) => {
    let price = null;
    let formattedPrice = "";
    
    if (property.listing_type === "SALE") {
      price = property.sale_price;
      if (price) {
        formattedPrice = `₦${Number(price).toLocaleString()}`;
      }
    }
    
    return formattedPrice || "Price on request";
  };

  // Fetch approved sale properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build API URL with filters
        let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/?listing_status=APPROVED&listing_type=SALE`;
        
        // Add filter parameters
        if (filters.city) {
          apiUrl += `&city=${encodeURIComponent(filters.city)}`;
        }
        
        if (filters.property_type) {
          apiUrl += `&property_type=${filters.property_type}`;
        }
        
        // Add price range parameters
        if (filters.price_range) {
          const [min, max] = filters.price_range.split('-').map(Number);
          if (filters.price_range.endsWith('+')) {
            apiUrl += `&min_price=${min}`;
          } else {
            apiUrl += `&min_price=${min}&max_price=${max}`;
          }
        }

        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) throw new Error('Failed to fetch properties');
        const responseData = await res.json();
        const propertiesData = responseData.data || [];
        
        const formattedProperties = propertiesData.map(property => ({
          id: property.id,
          title: property.property_name || 'Beautiful Property',
          price: extractPrice(property),
          description: `${property.bedrooms || 0} bed, ${property.bathrooms || 0} bath property in ${property.location || 'premium location'}`,
          image: property.thumbnail || 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
          type: 'sale',
          location: property.location || '',
          city: property.city || '',
          propertyStatus: property.property_status_display || 'Available',
          amenities: property.amenities || []
        }));
        
        setProperties(formattedProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [
    filters.price_range,
    filters.city,
    filters.property_type,
    filters.property_status,
    filters.lister_type
  ]);

  // Get unique locations and cities for filters
  const uniqueLocations = [...new Set(properties.map(property => property.location).filter(Boolean))];
  const uniqueCities = [...new Set(properties.map(property => property.city).filter(Boolean))];

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      city: '',
      property_type: '',
      price_range: '',
      property_status: '',
      lister_type: ''
    });
    setVisibleListings(6); // Reset to show first 6 items
  };

  // Load more properties
  const handleLoadMore = () => setVisibleListings((prev) => prev + 6);

  // Dropdown filter component with client-side hydration handling
  const FilterDropdown = ({ label, options, onChange, value }) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return (
        <div className="relative">
          <div className="border border-gray-300 rounded-md p-1 md:p-2 text-xs md:text-sm bg-white min-w-[70px] md:min-w-[120px] h-[28px] md:h-[38px]"></div>
        </div>
      );
    }

    return (
      <div className="relative">
        <select
          value={value}
          className="border border-gray-300 rounded-md p-1 md:p-2 appearance-none pr-4 md:pr-8 text-xs md:text-sm bg-white text-black hover:border-gray-400 focus:border-[#014d98] focus:outline-none min-w-[70px] md:min-w-[120px] cursor-pointer h-[28px] md:h-[38px] shadow-sm"
          onChange={(e) => onChange(e.target.value)}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            backgroundImage: 'none'
          }}
        >
          <option value="" className="bg-white text-black">{label}</option>
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option} className="bg-white text-black">
              {option.label || option}
            </option>
          ))}
        </select>
        <div className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 pointer-events-none bg-white">
          <IoMdArrowDropdown className="text-gray-500 text-sm md:text-xl" />
        </div>
      </div>
    );
  };

  const propertyTypes = [
    { value: 'TWO_BEDROOM_FLAT', label: 'Two Bedroom Flat' },
    { value: 'THREE_BEDROOM_FLAT', label: 'Three Bedroom Flat' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'DUPLEX', label: 'Duplex' },
    { value: 'BUNGALOW', label: 'Bungalow' }
  ];

  const propertyStatusOptions = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'SOLD', label: 'Sold' }
  ];

  const listerTypeOptions = [
    { value: 'LANDLORD', label: 'Landlord' },
    { value: 'AGENT', label: 'Agent' }
  ];

  const priceRanges = [
    { value: '0-5000000', label: 'Up to ₦5M' },
    { value: '5000000-10000000', label: '₦5M - ₦10M' },
    { value: '10000000-20000000', label: '₦10M - ₦20M' },
    { value: '20000000-50000000', label: '₦20M - ₦50M' },
    { value: '50000000-100000000', label: '₦50M - ₦100M' },
    { value: '100000000+', label: 'Above ₦100M' }
  ];

  // Filter properties by search query as other filters are handled by backend
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = searchQuery
      ? property.title.toLowerCase().includes(searchQuery) ||
        property.location.toLowerCase().includes(searchQuery) ||
        property.city.toLowerCase().includes(searchQuery)
      : true;

    return matchesSearch;
  });

  return (
    <div className="px-2 sm:px-14 py-4">
      <div className="pt-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1 md:gap-3 mb-4 md:mb-6 overflow-x-auto">
          <FilterDropdown
            label="City"
            options={uniqueCities}
            value={filters.city}
            onChange={(value) => setFilters({ ...filters, city: value })}
          />
          <FilterDropdown
            label="Type"
            options={propertyTypes}
            value={filters.property_type}
            onChange={(value) => setFilters({ ...filters, property_type: value })}
          />
          <FilterDropdown
            label="Price"
            options={priceRanges}
            value={filters.price_range}
            onChange={(value) => setFilters({ ...filters, price_range: value })}
          />
          <FilterDropdown
            label="Status"
            options={propertyStatusOptions}
            value={filters.property_status}
            onChange={(value) => setFilters({ ...filters, property_status: value })}
          />
          <FilterDropdown
            label="By"
            options={listerTypeOptions}
            value={filters.lister_type}
            onChange={(value) => setFilters({ ...filters, lister_type: value })}
          />
          <button
            onClick={handleResetFilters}
            className={`flex items-center gap-1 md:gap-2 transition-colors duration-200 ml-1 md:ml-0 ${
              Object.values(filters).some(value => value) 
                ? 'text-[#014d98] hover:text-[#3ab7b1]' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={!Object.values(filters).some(value => value)}
            title="Reset filters"
          >
            <VscClearAll className="transform rotate-90" size={14} />
            <span className="text-xs md:text-sm">Reset</span>
          </button>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-light mb-4 md:mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
          Properties
        </span>{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
          Available for Buying
        </span>
      </h1>

      {/* Loading State - Use Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <PropertyCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center text-red-500 mb-4">
          {error}
        </div>
      )}

      {!loading && (
        <>
          <p className="text-gray-500 mb-4 md:mb-6">{filteredProperties.length} properties</p>
          <p className="text-sm text-gray-400 mb-4">Last updated: {lastUpdated}</p>

          {/* Grid Layout */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProperties.slice(0, visibleListings).map((property) => (
                <ListingCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  price={property.price}
                  description={property.description}
                  image={property.image}
                  type={property.type}
                  propertyStatus={property.propertyStatus}
                  amenities={property.amenities}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">No properties found matching your criteria.</p>
            </div>
          )}

          {/* Load More Button */}
          {visibleListings < filteredProperties.length && (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-gray-600 mb-2">
                Showing {Math.min(filteredProperties.length, visibleListings)} of {filteredProperties.length} results
              </p>
              <Button
                label="Load More"
                onClick={handleLoadMore}
                className="h-10"
              />
            </div>
          )}

          {/* Other Cities Section - Only show if main results loaded successfully */}
          {properties.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-light mb-4 md:mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
                  Other Cities
                </span>{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
                  to Explore
                </span>
              </h2>
              <p className="text-gray-600 mb-6">
                Explore available properties for sale in these vibrant cities across Nigeria.
              </p>
              {/* Show some properties from cities that aren't in the current filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties
                  .filter(property => !filters.city || property.city !== filters.city)
                  .slice(0, 3)
                  .map((property) => (
                    <ListingCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      price={property.price}
                      description={property.description}
                      image={property.image}
                      type={property.type}
                    />
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Buy() {
  return (
    <Suspense fallback={<div className="w-full flex justify-center py-10"><PropertyCardSkeleton /></div>}>
      <BuyContent />
    </Suspense>
  );
}