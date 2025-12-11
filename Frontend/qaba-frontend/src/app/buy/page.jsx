'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import ListingCard from '../components/listingCard/ListingCard';
import Button from '../components/shared/Button';
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { VscClearAll } from "react-icons/vsc";
import { FiX, FiSearch } from "react-icons/fi";
import { PropertyCardSkeleton } from '../agent-dashboard/favourites/components/LoadingSkeletons';
import { useSearchParams } from 'next/navigation';
import { propertyLocationIndex } from "../utils/propertyLocationIndex";
import { ListingTypeCacheProvider, useListingTypeCache } from '../../contexts/ListingTypeCacheContext';

function BuyContent() {
  const [visibleListings, setVisibleListings] = useState(6);
  
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    price_range: '',
    property_status: '',
    lister_type: '',
    bedrooms: '',
    bathrooms: ''
  });


  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  // Use the buy cache context
  const { 
    properties, 
    cities: uniqueCities, 
    isLoading: loading, 
    error, 
    initialized,
    getProperties
  } = useListingTypeCache();

  // Fetch properties using the cache system
  useEffect(() => {
    // Only run if context is initialized
    if (!initialized) return;

    const fetchProperties = async () => {
      try {
        const currentFilters = {
          ...filters,
          searchTerm: searchTerm.trim()
        };

        // Always request current properties from the context. The context
        // will return cached (unfiltered) data when filters are empty,
        // or fetch filtered results when filters are present.
        await getProperties(currentFilters);
      } catch (err) {
        console.error('Error fetching properties:', err);
      }
    };

    fetchProperties();
  }, [filters, searchTerm, getProperties, initialized]);

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      city: '',
      property_type: '',
      price_range: '',
      property_status: '',
      lister_type: '',
      bedrooms: '',
      bathrooms: ''
    });
    setSearchTerm(''); // Reset search term
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
          className={`w-full h-10 sm:h-11 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border rounded-xl text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between
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
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="mr-1 p-0.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange('');
                  }
                }}
              >
                <FiX className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </span>
            )}
            {isOpen ? (
              <IoMdArrowDropup className="w-4 h-4 sm:w-5 sm:h-5 text-[#014d98]" />
            ) : (
              <IoMdArrowDropdown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            )}
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#014d98] rounded-xl shadow-xl z-[9999] max-h-64 overflow-y-auto">
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
    { value: 'HOUSE', label: 'House' },
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'SELF_CONTAIN', label: 'Self Contain' },
    { value: 'DUPLEX', label: 'Duplex' },
    { value: 'SEMI_DETACHED', label: 'Semi Detached' },
    { value: 'FULL_DETACHED', label: 'Full Detached' },
    { value: 'ONE_BEDROOM_FLAT', label: 'One Bedroom Flat' },
    { value: 'TWO_BEDROOM_FLAT', label: 'Two Bedroom Flat' },
    { value: 'THREE_BEDROOM_FLAT', label: 'Three Bedroom Flat' },
    { value: 'FOUR_BEDROOM_FLAT', label: 'Four Bedroom Flat' },
    { value: 'WAREHOUSE', label: 'Warehouse' },
    { value: 'EMPTY_LAND', label: 'Empty Land' },
    { value: 'LAND_WITH_BUILDING', label: 'Land with Building' }
  ];

  const propertyStatusOptions = [
    { value: 'AVAILABLE', label: 'Available Now' },
    { value: 'SOLD', label: 'Already Sold' }
  ];

  const listerTypeOptions = [
    { value: 'LANDLORD', label: 'Direct from Owner' },
    { value: 'AGENT', label: 'Listed by Agent' }
  ];

  const priceRanges = [
    { value: '0-5000000', label: 'Up to ₦5M' },
    { value: '5000000-10000000', label: '₦5M - ₦10M' },
    { value: '10000000-20000000', label: '₦10M - ₦20M' },
    { value: '20000000-50000000', label: '₦20M - ₦50M' },
    { value: '50000000-100000000', label: '₦50M - ₦100M' },
    { value: '100000000+', label: 'Above ₦100M' }
  ];

  const bedroomOptions = [
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5+', label: '5+ Bedrooms' }
  ];

  const bathroomOptions = [
    { value: '1', label: '1 Bathroom' },
    { value: '2', label: '2 Bathrooms' },
    { value: '3', label: '3 Bathrooms' },
    { value: '4', label: '4 Bathrooms' },
    { value: '5+', label: '5+ Bathrooms' }
  ];

  // Use properties directly since search is now handled by the backend
  const filteredProperties = properties;

  // Count active filters (include search term)
  const activeFiltersCount = Object.values(filters).filter(value => value).length + (searchTerm.trim() ? 1 : 0);

  return (
    <div className="px-4 sm:px-6 lg:px-14 py-4">
      <div className="pt-6">
        {/* Enhanced Search and Filters Section */}
        <div className="relative rounded-2xl p-4 sm:p-6 mb-8 border border-gray-100 shadow-sm">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl overflow-hidden"
            style={{
              backgroundImage: `url('/proper1.png')`
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 rounded-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-[#014d98]" />
                </div>
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 text-base bg-white border border-gray-200 rounded-xl focus:border-[#014d98] focus:outline-none transition-all duration-200 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filters Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                  <span>Active Filters:</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full border border-white/30">
                      {activeFiltersCount}
                    </span>
                  )}
                </h3>
                
                <button
                  onClick={handleResetFilters}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFiltersCount > 0 || searchTerm
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                  }`}
                  disabled={activeFiltersCount === 0 && !searchTerm}
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
                <CustomDropdown
                  label="Bedrooms"
                  placeholder="Bedrooms"
                  options={bedroomOptions}
                  value={filters.bedrooms}
                  onChange={(value) => setFilters({ ...filters, bedrooms: value })}
                />
                <CustomDropdown
                  label="Bathrooms"
                  placeholder="Bathrooms"
                  options={bathroomOptions}
                  value={filters.bathrooms}
                  onChange={(value) => setFilters({ ...filters, bathrooms: value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-light mb-4 md:mb-6">
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
                  propertyTypeDisplay={property.propertyTypeDisplay}
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
                      propertyTypeDisplay={property.propertyTypeDisplay}
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
    <ListingTypeCacheProvider listingType="SALE">
      <Suspense fallback={<div className="w-full flex justify-center py-10"><PropertyCardSkeleton /></div>}>
        <BuyContent />
      </Suspense>
    </ListingTypeCacheProvider>
  );
}