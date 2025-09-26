'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import ListingCard from '../components/listingCard/ListingCard';
import Button from '../components/shared/Button';
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { VscClearAll } from "react-icons/vsc";
import { FiSearch, FiX } from "react-icons/fi";
import { PropertyCardSkeleton } from '../agent-dashboard/favourites/components/LoadingSkeletons';
import { useSearchParams } from 'next/navigation';
import { usePropertiesCache } from '../../contexts/PropertiesCacheContext';
import { RotateCcw } from 'lucide-react';


function PropertiesContent() {
  const [visibleListings, setVisibleListings] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    property_type: '',
    price_range: '',
    property_status: '',
    lister_type: '',
    listing_type: '', // RENT or SALE
    bedrooms: '',
    bathrooms: ''
  });

  // Use the properties cache context
  const {
    properties,
    cities: uniqueCities,
    isLoading: loading,
    error,
    initialized,
    getProperties,
    refreshData,
    clearCache
  } = usePropertiesCache();

  // Fetch properties using the cache system
  useEffect(() => {
    // Only run if context is initialized and we have filters
    if (!initialized) return;
    
    const fetchProperties = async () => {
      try {
        const currentFilters = {
          ...filters,
          searchTerm: searchTerm.trim()
        };
        
        // Only fetch if we have filters or search term, otherwise use cached data
        const hasFilters = Object.values(currentFilters).some(value => value && value.trim());
        
        if (hasFilters) {
          await getProperties(currentFilters);
        }
        // If no filters, the context will handle loading cached data automatically
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
      state: '',
      property_type: '',
      price_range: '',
      property_status: '',
      lister_type: '',
      listing_type: '',
      bedrooms: '',
      bathrooms: ''
    });
    setSearchTerm(''); // Reset search term
    setVisibleListings(6);
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
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="mr-1 p-0.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <FiX className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </div>
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

  const listingTypes = [
    { value: 'RENT', label: 'For Rent' },
    { value: 'SALE', label: 'For Sale' }
  ];

  const propertyTypes = [
    { value: 'HOUSE', label: 'House' },
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'SELF_CONTAIN', label: 'Self Contain' },
    { value: 'TWO_BEDROOM_FLAT', label: 'Two Bedroom Flat' },
    { value: 'THREE_BEDROOM_FLAT', label: 'Three Bedroom Flat' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'DUPLEX', label: 'Duplex' },
    { value: 'BUNGALOW', label: 'Bungalow' }
  ];

  const propertyStatusOptions = [
    { value: 'AVAILABLE', label: 'Available Now' },
    { value: 'RENTED', label: 'Already Rented' },
    { value: 'SOLD', label: 'Already Sold' }
  ];

  const listerTypeOptions = [
    { value: 'LANDLORD', label: 'Direct from Owner' },
    { value: 'AGENT', label: 'Listed by Agent' }
  ];

  const priceRanges = [
    { value: '0-100000', label: 'Up to ₦100K' },
    { value: '100000-500000', label: '₦100K - ₦500K' },
    { value: '500000-1000000', label: '₦500K - ₦1M' },
    { value: '1000000-5000000', label: '₦1M - ₦5M' },
    { value: '5000000-10000000', label: '₦5M - ₦10M' },
    { value: '10000000-50000000', label: '₦10M - ₦50M' },
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

  // Count active filters
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
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-[#014d98]" />
              </div>
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchTerm(e.target.value);
                  }
                }}
                className="w-full h-12 sm:h-14 pl-12 pr-12 py-3 sm:py-4 text-base bg-white border border-gray-200 rounded-xl focus:border-[#014d98] focus:outline-none transition-all duration-200 placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-12 flex items-center pr-2"
                >
                  <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                </button>
              )}
              <button
                onClick={() => setSearchTerm(searchTerm)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white p-2 rounded-lg hover:shadow-lg transition-all duration-200">
                  <FiSearch className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </button>
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
              
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      await refreshData();
                    } catch (error) {
                      console.error('Refresh failed:', error);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-200"
                  title="Refresh data from server"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={handleResetFilters}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFiltersCount > 0
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                  }`}
                  disabled={activeFiltersCount === 0}
                  title="Reset all filters and search"
                >
                  <VscClearAll className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset All</span>
                  <span className="sm:hidden">Reset</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
              <CustomDropdown
                label="Type"
                placeholder="Listing Type"
                options={listingTypes}
                value={filters.listing_type}
                onChange={(value) => setFilters({ ...filters, listing_type: value })}
              />
              <CustomDropdown
                label="City"
                placeholder="Select City"
                options={uniqueCities}
                value={filters.city}
                onChange={(value) => setFilters({ ...filters, city: value })}
              />
              <CustomDropdown
                label="Property"
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
                label="Listed By"
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
                onChange={(value) => {
                  console.log('Bedroom filter changed to:', value);
                  setFilters({ ...filters, bedrooms: value });
                }}
              />
              <CustomDropdown
                label="Bathrooms"
                placeholder="Bathrooms"
                options={bathroomOptions}
                value={filters.bathrooms}
                onChange={(value) => {
                  console.log('Bathroom filter changed to:', value);
                  setFilters({ ...filters, bathrooms: value });
                }}
              />
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/20">
                <span className="text-xs text-white font-medium">Active filters:</span>
                {searchTerm.trim() && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#014d98] text-white text-xs rounded-full">
                                         Search: &quot;{searchTerm.substring(0, 20)}{searchTerm.length > 20 ? '...' : ''}&quot;
                    <button onClick={() => setSearchTerm('')} className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  
                  const getDisplayValue = () => {
                    switch (key) {
                      case 'listing_type':
                        return listingTypes.find(t => t.value === value)?.label || value;
                      case 'property_type':
                        return propertyTypes.find(t => t.value === value)?.label || value;
                      case 'property_status':
                        return propertyStatusOptions.find(t => t.value === value)?.label || value;
                      case 'lister_type':
                        return listerTypeOptions.find(t => t.value === value)?.label || value;
                      case 'price_range':
                        return priceRanges.find(t => t.value === value)?.label || value;
                      case 'bedrooms':
                        return bedroomOptions.find(t => t.value === value)?.label || value;
                      case 'bathrooms':
                        return bathroomOptions.find(t => t.value === value)?.label || value;
                      default:
                        return value;
                    }
                  };

                  return (
                    <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-[#3ab7b1] text-white text-xs rounded-full">
                      {getDisplayValue()}
                      <button 
                        onClick={() => setFilters({ ...filters, [key]: '' })}
                        className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-light mb-4 md:mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
          All
        </span>{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
          Properties
        </span>
      </h1>

      {/* Loading State - Use Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <PropertyCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center text-red-500 mb-4 p-4 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {!loading && (
        <>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm sm:text-base">
            {filteredProperties.length} properties found
            {activeFiltersCount > 0 && (
              <span className="ml-2 text-[#3ab7b1] font-medium">
                (filtered by {activeFiltersCount} criteria)
              </span>
            )}
          </p>

          {/* Grid Layout */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : searchQuery ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                                 <p className="text-xl text-gray-600 mb-2">No properties found for &quot;{searchQuery}&quot;</p>
                <p className="text-gray-500">Try adjusting your search criteria or browse all properties</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xl text-gray-600 mb-2">No properties match your criteria</p>
                <p className="text-gray-500">Try removing some filters or search terms</p>
              </div>
            </div>
          )}

          {/* Load More Button */}
          {visibleListings < filteredProperties.length && (
            <div className="mt-8 flex flex-col items-center">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Showing {Math.min(filteredProperties.length, visibleListings)} of {filteredProperties.length} results
                </p>
                <Button
                  label="Load More Properties"
                  onClick={handleLoadMore}
                  className="h-12 px-8 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:shadow-lg transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Featured Properties Section - Only show if main results loaded successfully */}
          {properties.length > 0 && (
            <div className="mt-16 sm:mt-20">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-light mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
                    Featured
                  </span>{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
                    Properties
                  </span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                  Discover our handpicked selection of premium properties across Nigeria.
                </p>
              </div>
              {/* Show some properties from different cities */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default function Properties() {
  return (
    <Suspense fallback={<div className="w-full flex justify-center py-10"><PropertyCardSkeleton /></div>}>
      <PropertiesContent />
    </Suspense>
  );
}