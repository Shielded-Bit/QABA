
'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import ListingCard from '../components/listingCard/ListingCard';
import Button from '../components/shared/Button';
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { VscClearAll } from "react-icons/vsc";
import { FiX } from "react-icons/fi";
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
        setError(null);
        
        // Build API URL with filters
        let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/?listing_status=APPROVED&listing_type=RENT`;
        
        // Add filter parameters
        if (filters.city) {
          apiUrl += `&city=${encodeURIComponent(filters.city)}`;
        }
        
        if (filters.property_type) {
          apiUrl += `&property_type=${filters.property_type}`;
        }
        
        if (filters.property_status) {
          apiUrl += `&property_status=${filters.property_status}`;
        }
        
        if (filters.lister_type) {
          apiUrl += `&lister_type=${filters.lister_type}`;
        }
        
        // Add price range parameters - using correct API parameter names
        if (filters.price_range) {
          if (filters.price_range.endsWith('+')) {
            const min = filters.price_range.replace('+', '');
            apiUrl += `&min_rent=${min}`;
          } else {
            const [min, max] = filters.price_range.split('-').map(Number);
            if (!isNaN(min)) {
              apiUrl += `&min_rent=${min}`;
            }
            if (!isNaN(max)) {
              apiUrl += `&max_rent=${max}`;
            }
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

  // Custom Dropdown Component
  const CustomDropdown = ({ label, options, onChange, value, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    if (!mounted) {
      return (
        <div className="relative min-w-[100px] sm:min-w-[120px]">
          <div className="h-10 sm:h-11 bg-white border border-gray-200 rounded-xl animate-pulse"></div>
        </div>
      );
    }

    const selectedOption = options.find(option => (option.value || option) === value);
    const displayText = selectedOption ? (selectedOption.label || selectedOption) : placeholder || label;

    return (
      <div className="relative min-w-[100px] sm:min-w-[120px]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-10 sm:h-11 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 rounded-xl text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between
            ${isOpen 
              ? 'border-[#014d98] shadow-lg shadow-blue-100' 
              : value 
                ? 'border-[#3ab7b1] bg-gradient-to-r from-blue-50 to-teal-50' 
                : 'border-gray-200 hover:border-gray-300'
            }
            hover:shadow-md focus:outline-none focus:border-[#014d98] focus:shadow-lg focus:shadow-blue-100`}
        >
          <span className={`truncate ${value ? 'text-[#014d98] font-semibold' : 'text-gray-600'}`}>
            {displayText}
          </span>
          <div className="flex items-center ml-2">
            {value && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="mr-1 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            {isOpen ? (
              <IoMdArrowDropup className="w-4 h-4 sm:w-5 sm:h-5 text-[#014d98]" />
            ) : (
              <IoMdArrowDropdown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            )}
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#014d98] rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
            <div className="py-2">
              {!value && (
                <div className="px-4 py-2 text-xs sm:text-sm text-gray-400 bg-gray-50 border-b border-gray-100">
                  Select {label}
                </div>
              )}
              {options.map((option, index) => {
                const optionValue = option.value || option;
                const optionLabel = option.label || option;
                const isSelected = optionValue === value;
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onChange(optionValue);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm transition-all duration-150 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50
                      ${isSelected 
                        ? 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white font-semibold' 
                        : 'text-gray-700 hover:text-[#014d98]'
                      }`}
                  >
                    {optionLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}
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

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => value).length;

  return (
    <div className="px-4 sm:px-6 lg:px-14 py-4">
      <div className="pt-6">
        {/* Enhanced Filters Section */}
        <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-teal-50 rounded-2xl p-4 sm:p-6 mb-8 border border-gray-100 shadow-sm">
          {/* Filters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold text-[#014d98] flex items-center gap-2">
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#3ab7b1] text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </h3>
              
              <button
                onClick={handleResetFilters}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeFiltersCount > 0
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                }`}
                disabled={activeFiltersCount === 0}
                title="Reset all filters"
              >
                <VscClearAll className="w-4 h-4" />
                <span className="hidden sm:inline">Reset All</span>
                <span className="sm:hidden">Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <CustomDropdown
                label="City"
                placeholder="Select City"
                options={uniqueCities}
                value={filters.city}
                onChange={(value) => setFilters({ ...filters, city: value })}
              />
              <CustomDropdown
                label="Type"
                placeholder="Property Type"
                options={propertyTypes}
                value={filters.property_type}
                onChange={(value) => setFilters({ ...filters, property_type: value })}
              />
              <CustomDropdown
                label="Price"
                placeholder="Price Range"
                options={priceRanges}
                value={filters.price_range}
                onChange={(value) => setFilters({ ...filters, price_range: value })}
              />
              <CustomDropdown
                label="Status"
                placeholder="Availability"
                options={propertyStatusOptions}
                value={filters.property_status}
                onChange={(value) => setFilters({ ...filters, property_status: value })}
              />
              <CustomDropdown
                label="By"
                placeholder="Lister Type"
                options={listerTypeOptions}
                value={filters.lister_type}
                onChange={(value) => setFilters({ ...filters, lister_type: value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-light mb-4 md:mb-6 ">
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