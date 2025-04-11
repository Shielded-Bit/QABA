'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";

const PropertyCard = ({ house }) => {
    const router = useRouter();
    
    const handleCardClick = () => {
        router.push(`/agent-dashboard/properties/${house.id}`);
    };
    
    // Enhanced price formatting
    const formatPrice = (price) => {
        // Handle null, undefined, NaN, or zero
        if ((price === null || price === undefined || isNaN(price))) {
            return "₦0"; // Default fallback
        }
        
        // Ensure we're working with a number
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        // Format with currency symbol and locale
        try {
            return `₦${Number(numericPrice).toLocaleString()}`;
        } catch (error) {
            console.error("Error formatting price:", error);
            return "₦0"; // Fallback
        }
    };
    
    return (
        <div 
            className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 w-11/12 sm:w-full max-w-xs shrink-0 cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={handleCardClick}
        >
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image src={house.image || "/api/placeholder/400/320"} alt={house.name} layout="fill" objectFit="cover" />
                <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded text-white ${
                        house.type === "Buy" ? "bg-blue-600" : "bg-green-600"
                    }`}
                >
                    {house.type}
                </span>
                
                {/* Draft tag - positioned in the opposite corner from the buy/rent tag */}
                {house.listing_status === "DRAFT" && (
                    <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded text-white bg-gray-600">
                        Draft
                    </span>
                )}
            </div>
            <div className="mt-3">
                <h3 className="font-semibold text-lg">{house.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{house.location}</p>
                <p className="font-bold mt-2 text-gray-900">{formatPrice(house.amount)}</p>
                {/* Add rent frequency if available */}
                {house.type === "Rent" && house.rent_frequency && (
                    <p className="text-xs text-gray-500 mt-1">
                        {house.rent_frequency_display || house.rent_frequency}
                    </p>
                )}
            </div>
        </div>
    );
};

const PropertySection = ({ title, properties, className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // For larger screens

  const handlePageChange = (newPage) => {
      const totalPages = Math.ceil(properties.length / itemsPerPage);
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
      }
  };

  const displayedProperties = properties.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  return (
      <div className="mb-12">
          <h2 className={`text-gray-600 mb-6 ${className}`}>{title}</h2>
          {/* Scrollable container for mobile */}
          <div className="flex overflow-x-scroll snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayedProperties.length > 0 ? (
                  displayedProperties.map((house, index) => (
                      <PropertyCard key={house.id || index} house={house} />
                  ))
              ) : (
                  <p className="text-gray-500 italic">No properties available</p>
              )}
          </div>
          {properties.length > itemsPerPage && (
              <div className="flex justify-center items-center mt-6 space-x-3">
                  <button
                      className="p-3 bg-gray-300 rounded-full disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                  >
                      <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="flex space-x-2">
                      {[...Array(Math.ceil(properties.length / itemsPerPage))].map((_, index) => (
                          <button
                              key={index}
                              className={`w-3 h-3 rounded-full ${
                                  currentPage === index + 1 ? "bg-blue-600" : "bg-gray-300"
                              }`}
                              onClick={() => handlePageChange(index + 1)}
                          />
                      ))}
                  </div>
                  <button
                      className="p-3 bg-gray-300 rounded-full disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === Math.ceil(properties.length / itemsPerPage)}
                  >
                      <ChevronRight className="w-6 h-6" />
                  </button>
              </div>
          )}
      </div>
  );
};

export default function DraftProperties() {
  const [draftProperties, setDraftProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const router = useRouter();

  // Function to extract and format price from property data
  const extractPrice = (property) => {
    let price = null;
    
    // For rent properties
    if (property.listing_type === "RENT" || property.listing_type === "rent") {
      // Direct property access based on API structure
      price = property.rent_price;
      
      // Fallbacks if the primary field is not available
      if (price === null || price === undefined) {
        price = property.rentPrice ||
               property.price ||
               property.monthly_rent || 
               property.yearlyRent ||
               property.rental_price ||
               property.rent ||
               property.amount;
      }
    } 
    // For sale properties
    else if (property.listing_type === "SALE" || property.listing_type === "sale" || property.listing_type === "BUY") {
      // Direct property access based on API structure
      price = property.sale_price;
      
      // Fallbacks if the primary field is not available
      if (price === null || price === undefined) {
        price = property.salePrice ||
               property.price ||
               property.amount;
      }
    }
    
    // Handle various price formats
    if (price !== null && price !== undefined) {
      // If price is a string
      if (typeof price === 'string') {
        // Remove any non-numeric characters except decimal point
        price = price.replace(/[^\d.]/g, '');
        // Convert to number
        price = parseFloat(price);
      }
      
      // Check if conversion worked
      if (isNaN(price)) {
        console.error("Price conversion to number failed:", price);
        price = null;
      }
    }
    
    return price;
  };

  useEffect(() => {
    const fetchDraftProperties = async () => {
      try {
        setLoading(true);
        // Use the specific endpoint for draft properties
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/properties/?listing_status=DRAFT`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const rawData = await response.json();
        
        // Check if the response has the expected structure and extract the array
        const data = Array.isArray(rawData) ? rawData : 
                     rawData.results ? rawData.results : 
                     rawData.data ? rawData.data : 
                     rawData.properties ? rawData.properties : [];
        
        // Verify that data is an array before mapping
        if (!Array.isArray(data)) {
          console.error("API response is not an array:", rawData);
          throw new Error("Invalid API response format");
        }
        
        // Process and transform the data with direct field access
        const formattedProperties = data.map(property => {
          // Extract price using our improved function
          const price = extractPrice(property);
          
          // Get image with direct field access first, then fallbacks
          const image = property.thumbnail || 
                       (property.images && property.images.length > 0 ? property.images[0].image_url : null) ||
                       "/api/placeholder/400/320";
          
          return {
            id: property.id,
            name: property.property_name || 'Unnamed Property',
            location: property.location || 'Location not specified',
            amount: price, 
            image: image,
            type: (property.listing_type === "SALE" || property.listing_type === "sale") ? "Buy" : "Rent",
            listing_status: property.listing_status,
            rent_frequency: property.rent_frequency,
            rent_frequency_display: property.rent_frequency_display
          };
        });
        
        // Set draft properties
        setDraftProperties(formattedProperties);
        setFilteredProperties(formattedProperties);
        
      } catch (err) {
        console.error("Failed to fetch draft properties:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDraftProperties();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...draftProperties];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      result = result.filter(property => 
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType) {
      result = result.filter(property => property.type === filterType);
    }
    
    // Apply sorting
    if (sortBy === 'price_high') {
      result.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (sortBy === 'price_low') {
      result.sort((a, b) => (a.amount || 0) - (b.amount || 0));
    }
    // For 'newest' we assume the data already comes sorted by newest
    
    setFilteredProperties(result);
  }, [searchTerm, filterType, sortBy, draftProperties]);

  // Clear search term
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Apply filters and close the filter panel
  const applyFilters = () => {
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterType('');
    setSortBy('newest');
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="w-full mx-auto px-6 md:px-12 bg-gray-100 py-12 flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading draft properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto px-6 md:px-12 bg-gray-100 py-12 flex justify-center items-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-700">Error loading draft properties: {error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 md:px-0 bg-gray-100 py-8">
   {/* Search and Filter Area - Enhanced responsive design */}
      <div className="mb-6 relative">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          {/* Search input - full width on mobile, partial width on desktop */}
          <div className="relative flex-grow mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for specific properties"
              className="block w-[100%] md:w-[50%] sm:w-[100%] pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={clearSearch}
              >
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Filter button - aligned end on all screens */}
          <button 
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 self-end md:self-auto"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2 text-gray-500" />
            Filter
          </button>
        </div>
        
        {/* Filter dropdown - improved responsive design */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-md shadow-md border border-gray-200 absolute z-10 w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Filter by:</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowFilters(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Buy">Buy</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                onClick={resetFilters}
              >
                Reset
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      <PropertySection 
        title="Continue where you left off" 
        properties={filteredProperties} 
        className="text-sm md:text-xl font-medium" 
      />
      
      {filteredProperties.length === 0 && !loading && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
  <h3 className="text-xl font-semibold mb-4">No Draft Properties</h3>
  <p className="text-gray-600 mb-6">
    {searchTerm || filterType ? 
      `No properties matching your search criteria found.` : 
      "You don't have any properties saved as drafts."}
  </p>
  {!searchTerm && !filterType && (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <button 
        className="bg-gradient-to-r from-blue-900 to-teal-400 hover:from-blue-700 hover:to-teal-500 text-white py-2 px-6 rounded-md transition duration-300 w-full sm:w-auto"
        onClick={() => router.push('/agent-dashboard/for-sell')}
      >
        Create Property for Sale
      </button>
      <button 
        className="bg-gradient-to-r from-green-900 to-yellow-400 hover:from-green-700 hover:to-yellow-500 text-white py-2 px-6 rounded-md transition duration-300 w-full sm:w-auto"
        onClick={() => router.push('/agent-dashboard/for-rent')}
      >
        Create Property for Rent
      </button>
    </div>
  )}
</div>

      )}
    </div>
  );
}