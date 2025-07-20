
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ListingCard from '../components/listingCard/ListingCard';
import Button from '../components/shared/Button';
import { IoMdArrowDropdown } from "react-icons/io";
import { VscClearAll } from "react-icons/vsc";
import { PropertyCardSkeleton } from '../agent-dashboard/favourites/components/LoadingSkeletons';
import { useSearchParams } from 'next/navigation';
import { propertyLocationIndex } from "../utils/propertyLocationIndex";

function RentContent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleListings, setVisibleListings] = useState(6);
  // Remove static date to prevent hydration mismatch
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const [filters, setFilters] = useState({
    city: '',
    state: '',
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
    
    if (property.listing_type === "RENT") {
      price = property.rent_price;
      if (price) {
        formattedPrice = `₦${Number(price).toLocaleString()} ${property.rent_frequency === "MONTHLY" ? "Per Month" : "Per Year"}`;
      }
    }
    
    return formattedPrice || "Price on request";
  };

  // Fetch approved rental properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Start with base URL
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/?listing_status=APPROVED&listing_type=RENT`;
        
        // Add all filter parameters if they exist
        if (filters.city) {
          url += `&q=${encodeURIComponent(filters.city)}&city=${encodeURIComponent(filters.city)}`;
        }
        
        if (filters.property_type) {
          url += `&property_type=${encodeURIComponent(filters.property_type)}`;
        }

        if (filters.property_status) {
          url += `&property_status=${encodeURIComponent(filters.property_status)}`;
        }

        if (filters.lister_type) {
          url += `&lister_type=${encodeURIComponent(filters.lister_type)}`;
        }
        
        // Add price range parameters if they exist
        if (filters.price_range) {
          const [min, max] = filters.price_range.split('-').map(Number);
          if (filters.price_range.endsWith('+')) {
            url += `&min_total=${min}`;
          } else {
            url += `&min_total=${min}&max_total=${max}`;
          }
        }

        const response = await fetch(url, {
          headers: {
            'accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const responseData = await response.json();
        
        // Extract the data array based on the actual API response structure
        const propertiesData = responseData.data || [];
        
        // Map API data to our component's expected format
        const formattedProperties = propertiesData.map(property => ({
          id: property.id,
          title: property.property_name || 'Beautiful Property',
          price: extractPrice(property),
          description: `${property.bedrooms || 0} bed, ${property.bathrooms || 0} bath property in ${property.location || 'premium location'}`,
          image: property.thumbnail || 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
          type: 'rent',
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
  }, [filters.price_range, filters.city, filters.property_type, filters.property_status, filters.lister_type]); // Refetch when any filter changes

  // Get unique cities for filters
  const uniqueCities = [...new Set(properties.map(property => property.city).filter(Boolean))];

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      city: '',
      state: '',
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
          className="border border-gray-300 rounded-md p-1 md:p-2 appearance-none pr-4 md:pr-8 text-xs md:text-sm bg-white hover:border-gray-400 focus:border-[#014d98] focus:outline-none min-w-[70px] md:min-w-[120px] cursor-pointer h-[28px] md:h-[38px]"
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
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
    { value: 'AVAILABLE', label: 'Available Now' },
    { value: 'RENTED', label: 'Already Rented' }
  ];

  const listerTypeOptions = [
    { value: 'LANDLORD', label: 'Direct from Owner' },
    { value: 'AGENT', label: 'Listed by Agent' }
  ];

  const priceRanges = [
    { value: '0-100000', label: 'Up to ₦100,000' },
    { value: '100000-300000', label: '₦100,000 - ₦300,000' },
    { value: '300000-500000', label: '₦300,000 - ₦500,000' },
    { value: '500000-1000000', label: '₦500,000 - ₦1,000,000' },
    { value: '1000000-2000000', label: '₦1M - ₦2M' },
    { value: '2000000+', label: 'Above ₦2M' }
  ];

  // Filter properties only by search query as other filters are handled by the backend
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = searchQuery
      ? property.title.toLowerCase().includes(searchQuery) ||
        property.location.toLowerCase().includes(searchQuery) ||
        property.city.toLowerCase().includes(searchQuery)
      : true;

    return matchesSearch;
  });

  // Find similar properties if no exact match
  let similarProperties = [];
  if (searchQuery && filteredProperties.length === 0) {
    // Try to match by state/city/LGA using the index
    let foundState = null;
    Object.keys(propertyLocationIndex).forEach((state) => {
      if (searchQuery.includes(state)) foundState = state;
    });
    if (foundState) {
      // Find properties in the state or its LGAs
      similarProperties = properties.filter((property) => {
        const city = property.city?.toLowerCase() || "";
        const location = property.location?.toLowerCase() || "";
        return (
          city.includes(foundState) ||
          location.includes(foundState) ||
          propertyLocationIndex[foundState].some((lga) =>
            city.includes(lga.toLowerCase()) || location.includes(lga.toLowerCase())
          )
        );
      });
    }
    // If still none, fallback to partial match
    if (similarProperties.length === 0) {
      similarProperties = properties.filter((property) => {
        return (
          property.title.toLowerCase().includes(searchQuery.slice(0, 3)) ||
          property.location.toLowerCase().includes(searchQuery.slice(0, 3)) ||
          property.city.toLowerCase().includes(searchQuery.slice(0, 3))
        );
      });
    }
  }

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
      <h1 className="text-3xl font-light mb-4 md:mb-6 ">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
          Properties
        </span>{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
          Available for Renting
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
          <p className="text-gray-500 mb-4 md:mb-6">{filteredProperties.length} rentals</p>
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
          ) : searchQuery ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600 mb-4">No properties found for &quot;{searchQuery}&quot;.</p>
              {similarProperties.length > 0 ? (
                <>
                  <p className="text-lg text-gray-500 mb-4">Showing similar properties:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {similarProperties.slice(0, visibleListings).map((property) => (
                      <ListingCard
                        key={property.id}
                        id={property.id}
                        title={property.title}
                        price={property.price}
                        description={property.description}
                        image={property.image}
                        type={property.type}
                        propertyStatus={property.propertyStatus}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-gray-500 mb-2">No similar properties found.</p>
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mt-4"></div>
                </div>
              )}
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
                Explore available rental homes in these vibrant cities across Nigeria.
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

export default function Rent() {
  return (
    <Suspense fallback={<div className="w-full flex justify-center py-10"><PropertyCardSkeleton /></div>}>
      <RentContent />
    </Suspense>
  );
}