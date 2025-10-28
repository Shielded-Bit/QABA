"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, RotateCcw, Filter, ChevronDown } from "lucide-react";
import { createPropertySlug } from "@/utils/slugHelper";

const AllListedProperties = () => {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [allProperties, setAllProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showResetDropdown, setShowResetDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const states = useMemo(() => {
    if (!allProperties.length) return [];
    const stateSet = new Set();
    allProperties.forEach(property => {
      if (property.state && property.state.trim()) {
        stateSet.add(property.state.trim());
      }
    });
    return Array.from(stateSet).sort();
  }, [allProperties]);

  const cities = useMemo(() => {
    if (!allProperties.length) return [];
    const citySet = new Set();
    allProperties.forEach(property => {
      // Filter cities by selected state if one is chosen
      if (selectedState && property.state !== selectedState) return;
      if (property.city && property.city.trim()) {
        citySet.add(property.city.trim());
      }
    });
    return Array.from(citySet).sort();
  }, [allProperties, selectedState]);

  // Search suggestions based on property names and locations
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const suggestions = [];
    const searchLower = searchTerm.toLowerCase();
    
    // Add property name suggestions
    allProperties.forEach(property => {
      if (property.name && property.name.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'property',
          value: property.name,
          property: property
        });
      }
    });
    
    // Add location suggestions
    const locationSet = new Set();
    allProperties.forEach(property => {
      if (property.city && property.city.toLowerCase().includes(searchLower)) {
        locationSet.add(property.city);
      }
      if (property.state && property.state.toLowerCase().includes(searchLower)) {
        locationSet.add(property.state);
      }
    });
    
    Array.from(locationSet).forEach(location => {
      suggestions.push({
        type: 'location',
        value: location
      });
    });
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }, [searchTerm, allProperties]);

  // Modern filtering using useMemo for better performance
  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // Filter by listing type
      const matchesFilter = activeFilter === "ALL" || property.listingType === activeFilter;
      
      // Filter by state
      const matchesState = !selectedState || property.state === selectedState;
      
      // Filter by city
      const matchesCity = !selectedCity || property.city === selectedCity;
      
      // Filter by search term
      const matchesSearch = !searchTerm || (() => {
        const term = searchTerm.toLowerCase();
        return property.name.toLowerCase().includes(term) ||
               property.address.toLowerCase().includes(term);
      })();
      
      return matchesFilter && matchesState && matchesCity && matchesSearch;
    });
  }, [allProperties, activeFilter, selectedState, selectedCity, searchTerm]);

  useEffect(() => {
    fetchAllProperties();
  }, []);

  // Handle URL query parameters for filtering
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && ['ALL', 'RENT', 'SALE'].includes(filterParam)) {
      setActiveFilter(filterParam);
    }
  }, [searchParams]);

  const fetchAllProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/?listing_status=APPROVED`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch properties');
      const data = await res.json();
      const formattedProperties = data.data.map((item) => ({
        id: item.id,
        name: item.property_name,
        address: item.location,
        state: item.state || '',
        city: item.city || '',
        price: item.listing_type === 'RENT'
          ? `₦${Number(item.rent_price).toLocaleString()} / ${item.rent_frequency?.toLowerCase()}`
          : `₦${Number(item.sale_price).toLocaleString()}`,
        status: item.listing_type === 'RENT' ? 'Available for Rent' : 'Listed for Sale',
        listingType: item.listing_type,
        image: item.thumbnail || 'https://via.placeholder.com/150',
        listed_date: new Date(item.listed_date).toLocaleDateString(),
      }));
      setAllProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching all properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedCity("");
    setActiveFilter("ALL");
    setShowResetDropdown(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearchDropdown(value.length >= 2);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.value);
    setShowSearchDropdown(false);
  };

  const handleSearchFocus = () => {
    if (searchTerm.length >= 2) {
      setShowSearchDropdown(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow clicking on suggestions
    setTimeout(() => setShowSearchDropdown(false), 200);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setShowResetDropdown(false);
  };

  const resetStateFilter = () => {
    setSelectedState("");
    setShowResetDropdown(false);
  };

  const resetCityFilter = () => {
    setSelectedCity("");
    setShowResetDropdown(false);
  };

  const resetListingType = () => {
    setActiveFilter("ALL");
    setShowResetDropdown(false);
  };

  const hasActiveFilters = searchTerm || selectedState || selectedCity || activeFilter !== "ALL";



  const PropertyCard = ({ id, image, name, address, status, price }) => (
    <Link href={`/details/${createPropertySlug(name, id)}`} passHref>
      <div className="group bg-white rounded-2xl border border-gray-200/50 p-4 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-1">
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <Image 
              src={image} 
              alt={name} 
              width={192} 
              height={192} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            {/* Property Name - First Line */}
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight group-hover:text-[#014d98] transition-colors break-words">
              {name}
            </h3>
            
            {/* Price - Second Line */}
            <p className="font-bold text-[#014d98] text-xs sm:text-sm break-words">
              {price}
            </p>
            
            <p className="text-sm text-gray-600 flex items-center gap-1 break-words">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="break-words">{address}</span>
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${
                status.includes('Rent') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  // Skeleton for All Listed Properties
  const PropertyCardSkeleton = () => (
    <div className="group bg-white rounded-2xl border border-gray-200/50 p-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="h-full"
      onClick={() => {
        setShowResetDropdown(false);
        setShowSearchDropdown(false);
      }}
    >
      {/* Hero Section with Background Image and Overlay */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 h-[140px] flex items-end rounded-t-2xl mx-4 lg:mx-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-t-2xl"
          style={{
            backgroundImage: `url('/proper.png')`
          }}
        />
        
        {/* Gradient Overlay - Dark left to light right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 rounded-t-2xl"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full px-2 sm:px-4 lg:px-6 pb-3 sm:pb-4">
          <div className="w-full">
            {/* Hero Content with Icon and Description */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Text Content */}
                <div>
                  <h1 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-0 sm:mb-1">
                    Property Listings
                  </h1>
                  <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-semibold">
                    Discover and explore our curated collection of premium properties
                  </p>
                </div>
              </div>
              
              {/* Property Count */}
              <div className="text-right">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-3 border border-white/20">
                  <div className="text-white">
                    <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold">{filteredProperties.length}</span>
                    <span className="ml-1 text-gray-200 text-xs sm:text-sm">
                      {filteredProperties.length === 1 ? 'property' : 'properties'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - Moved below hero */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="w-full">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          {/* Navigation Tabs - Compact */}
          <div className="mb-4">
            <div className="flex gap-1 p-1.5 overflow-x-auto scrollbar-hide bg-gray-100 rounded-lg">
              <button 
                className={`flex-1 min-w-0 py-2 px-3 text-center font-medium rounded-md transition-all duration-200 text-xs whitespace-nowrap ${
                  activeFilter === "ALL" 
                    ? "text-white bg-gradient-to-r from-[#014d98] to-[#3ab7b1] shadow-md" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-white"
                }`}
                onClick={() => setActiveFilter("ALL")}
              >
                All Properties
              </button>
              <button 
                className={`flex-1 min-w-0 py-2 px-3 text-center font-medium rounded-md transition-all duration-200 text-xs whitespace-nowrap ${
                  activeFilter === "RENT" 
                    ? "text-white bg-gradient-to-r from-[#014d98] to-[#3ab7b1] shadow-md" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-white"
                }`}
                onClick={() => setActiveFilter("RENT")}
              >
                For Rent
              </button>
              <button 
                className={`flex-1 min-w-0 py-2 px-3 text-center font-medium rounded-md transition-all duration-200 text-xs whitespace-nowrap ${
                  activeFilter === "SALE" 
                    ? "text-white bg-gradient-to-r from-[#014d98] to-[#3ab7b1] shadow-md" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-white"
                }`}
                onClick={() => setActiveFilter("SALE")}
              >
                For Sale
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Left Side - Search Input with Dropdown */}
            <div className="w-full lg:w-auto lg:flex-1 lg:max-w-md">
              <div className="relative group" onClick={(e) => e.stopPropagation()}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#014d98] transition-colors" />
                </div>
                <input
                  type="text"
                  className="pl-9 block w-full rounded-lg border-0 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#014d98] focus:bg-white transition-all duration-200 text-sm"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                
                {/* Search Suggestions Dropdown */}
                {showSearchDropdown && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-shrink-0">
                          {suggestion.type === 'property' ? (
                            <div className="w-8 h-8 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center">
                              <Search className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Search className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.value}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {suggestion.type === 'property' ? 'Property' : 'Location'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Side - State and City Filters */}
            <div className="flex gap-2 lg:flex-shrink-0">
              {/* State Filter */}
              <div className="relative w-32 sm:w-36">
                <select
                  className="block w-full rounded-lg border-0 bg-gray-50 py-2 px-3 pr-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#014d98] focus:bg-white transition-all duration-200 text-sm appearance-none"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity(""); // Reset city when state changes
                  }}
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </div>
              </div>
              
              {/* City Filter */}
              <div className="relative w-32 sm:w-36">
                <select
                  className="block w-full rounded-lg border-0 bg-gray-50 py-2 px-3 pr-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#014d98] focus:bg-white transition-all duration-200 text-sm appearance-none"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                >
                  <option value="">
                    {selectedState ? 'All Cities' : 'Select State First'}
                  </option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </div>
              </div>
              
              {/* Reset Filter - Just Filter Icon with Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowResetDropdown(!showResetDropdown)}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border ${
                    hasActiveFilters 
                      ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200 hover:from-red-100 hover:to-red-200' 
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                  }`}
                >
                  <Filter className={`h-3 w-3 ${hasActiveFilters ? 'text-red-600' : 'text-gray-600'}`} />
                </button>
                
                {/* Reset Dropdown Menu */}
                {showResetDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                      Reset Options
                    </div>
                    
                    {searchTerm && (
                      <button
                        onClick={resetSearch}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <Search className="h-4 w-4" />
                        <span>Clear Search</span>
                      </button>
                    )}
                    
                    {selectedState && (
                      <button
                        onClick={resetStateFilter}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <Filter className="h-4 w-4" />
                        <span>Clear State Filter</span>
                      </button>
                    )}
                    
                    {selectedCity && (
                      <button
                        onClick={resetCityFilter}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <Filter className="h-4 w-4" />
                        <span>Clear City Filter</span>
                      </button>
                    )}
                    
                    {activeFilter !== "ALL" && (
                      <button
                        onClick={resetListingType}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <Filter className="h-4 w-4" />
                        <span>Clear Listing Type</span>
                      </button>
                    )}
                    
                    {hasActiveFilters && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={resetFilters}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>Reset All Filters</span>
                        </button>
                      </>
                    )}
                    
                    {!hasActiveFilters && (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No active filters to reset
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Results Summary */}
          {hasActiveFilters && (
            <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#014d98] rounded-full flex-shrink-0"></div>
                <p className="text-sm text-gray-700 break-words">
                  <span className="font-semibold text-[#014d98]">
                    {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                  </span>
                  <span className="text-gray-600"> found</span>
                  {activeFilter !== "ALL" && <span className="text-gray-600"> for {activeFilter.toLowerCase()}</span>}
                  {selectedState && <span className="text-gray-600"> in {selectedState}</span>}
                  {selectedCity && <span className="text-gray-600">, {selectedCity}</span>}
                  {searchTerm && <span className="text-gray-600"> matching &quot;{searchTerm}&quot;</span>}
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 lg:px-6 py-6">
        {isLoading ? (
          <div>
            <p className="text-center text-blue-600 mb-4">Loading properties...</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {[...Array(6)].map((_, idx) => (
                <PropertyCardSkeleton key={idx} />
              ))}
            </div>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <div className="max-w-md mx-auto px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">No properties found</h3>
              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                {hasActiveFilters 
                  ? "We couldn't find any properties matching your current search criteria. Try adjusting your filters or search terms."
                  : "No properties are currently available. Please check back later or contact support."
                }
              </p>
              <div className="space-y-2">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 font-medium text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset all filters
                  </button>
                )}
                <button
                  onClick={() => fetchAllProperties()}
                  className="block mx-auto text-blue-600 hover:text-blue-800 text-sm"
                >
                  Refresh properties
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllListedProperties;