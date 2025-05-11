import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

// Modal component for viewing all properties with enhanced filtering
const PropertyModal = ({ isOpen, onClose, filterType }) => {
  const [activeFilter, setActiveFilter] = useState(filterType || "ALL");
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  
  // Extract unique states from properties
  const states = useMemo(() => {
    if (!allProperties.length) return [];
    
    const stateSet = new Set();
    allProperties.forEach(property => {
      // Extract state from address (assuming format like "123 Street, City, State")
      const addressParts = property.address.split(',');
      if (addressParts.length > 1) {
        const state = addressParts[addressParts.length - 1].trim();
        if (state) stateSet.add(state);
      }
    });
    
    return Array.from(stateSet).sort();
  }, [allProperties]);

  useEffect(() => {
    if (isOpen) {
      fetchAllProperties();
    }
  }, [isOpen]);

  useEffect(() => {
    if (allProperties.length > 0) {
      applyFilters();
    }
  }, [activeFilter, searchTerm, selectedState, allProperties]);

  const fetchAllProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/properties/?listing_status=APPROVED`, {
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
        price: item.listing_type === 'RENT'
          ? `₦${Number(item.rent_price).toLocaleString()} / ${item.rent_frequency?.toLowerCase()}`
          : `₦${Number(item.sale_price).toLocaleString()}`,
        status: item.listing_type === 'RENT' ? 'Available for Rent' : 'Listed for Sale',
        listingType: item.listing_type,
        image: item.thumbnail || 'https://via.placeholder.com/150',
        listed_date: new Date(item.listed_date).toLocaleDateString(),
      }));

      setAllProperties(formattedProperties);
      applyFilters(formattedProperties);
    } catch (error) {
      console.error("Error fetching all properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (properties = allProperties) => {
    let result = [...properties];
    
    // Apply listing type filter
    if (activeFilter !== "ALL") {
      result = result.filter(p => p.listingType === activeFilter);
    }
    
    // Apply state filter
    if (selectedState) {
      result = result.filter(property => {
        const addressParts = property.address.split(',');
        if (addressParts.length > 1) {
          const state = addressParts[addressParts.length - 1].trim();
          return state === selectedState;
        }
        return false;
      });
    }
    
    // Apply search term filter (property name)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(property => 
        property.name.toLowerCase().includes(term) ||
        property.address.toLowerCase().includes(term)
      );
    }
    
    setFilteredProperties(result);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setActiveFilter("ALL");
  };

  // Enhanced Property Card with Next.js Link component
  const PropertyCard = ({ id, image, name, address, status, price, listed_date }) => (
    <Link href={`/details/${id}`} passHref>
      <div 
        onClick={() => onClose()} // Close modal when navigating
        className="flex items-start gap-3 border rounded-lg p-3 hover:shadow-md transition cursor-pointer"
      >
        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
          <Image src={image} alt={name} width={96} height={96} className="object-cover w-full h-full" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
            <p className="font-semibold text-[#014d98] whitespace-nowrap">{price}</p>
          </div>
          <p className="text-sm text-gray-500 truncate">{address}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-green-600">{status}</p>
            <p className="text-xs text-gray-400">Listed: {listed_date}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">All Properties</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b">
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeFilter === "ALL" ? "text-[#014d98] border-b-2 border-[#014d98]" : "text-gray-500"}`}
            onClick={() => setActiveFilter("ALL")}
          >
            All Properties
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeFilter === "RENT" ? "text-[#014d98] border-b-2 border-[#014d98]" : "text-gray-500"}`}
            onClick={() => setActiveFilter("RENT")}
          >
            For Rent
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeFilter === "SALE" ? "text-[#014d98] border-b-2 border-[#014d98]" : "text-gray-500"}`}
            onClick={() => setActiveFilter("SALE")}
          >
            For Sale
          </button>
        </div>
        
        {/* Enhanced Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search by name */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[#014d98] focus:ring-[#014d98] focus:outline-none"
                  placeholder="Search by name or address"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filter by state */}
            <div className="w-full md:w-64">
              <select
                className="block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[#014d98] focus:ring-[#014d98] focus:outline-none"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            {/* Reset filters button */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              Reset Filters
            </button>
          </div>
          
          {/* Filter summary */}
          {(searchTerm || selectedState || activeFilter !== "ALL") && (
            <div className="mt-3 text-sm text-gray-600">
              <p>
                Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                {activeFilter !== "ALL" ? ` for ${activeFilter.toLowerCase()}` : ''}
                {selectedState ? ` in ${selectedState}` : ''}
                {searchTerm ? ` matching "${searchTerm}"` : ''}
              </p>
            </div>
          )}
        </div>

        {/* Properties List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#014d98]"></div>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No properties found matching your filters.
              <button
                onClick={resetFilters}
                className="block mx-auto mt-2 text-[#014d98] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;