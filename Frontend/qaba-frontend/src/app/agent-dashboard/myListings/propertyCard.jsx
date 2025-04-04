'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const PropertyCard = ({ house }) => {
    const router = useRouter();
    
    const handleCardClick = () => {
        router.push(`/agent-dashboard/properties/${house.id}`);
    };
    
    // Enhanced price formatting
    const formatPrice = (price) => {
        // Debug the incoming price value
        console.log(`Formatting price: ${price}, type: ${typeof price}`);
        
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
                                  currentPage === index + 1 ? "bg-gray-800" : "bg-gray-300"
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

export default function OurWork() {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [publishedProperties, setPublishedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Remove the filter to get all properties
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/properties/`, {
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
        
        // Use console.table for clearer debugging
        console.table(formattedProperties.slice(0, 3).map(p => ({
          id: p.id,
          name: p.name,
          type: p.type,
          amount: p.amount,
          listing_status: p.listing_status
        })));
        
        // Filter properties by status
        setPendingProperties(formattedProperties.filter(property => 
          property.listing_status === "PENDING" || 
          property.listing_status === "pending" || 
          property.listing_status === "DRAFT" || 
          property.listing_status === "draft"
        ));
        
        setPublishedProperties(formattedProperties.filter(property => 
          property.listing_status === "PUBLISHED" || 
          property.listing_status === "published" || 
          property.listing_status === "ACTIVE" || 
          property.listing_status === "active" ||
          property.listing_status === "LIVE" ||
          property.listing_status === "live"
        ));
        
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="w-full mx-auto px-6 md:px-12 xl:px-6 bg-gray-100 py-12 pl-8 flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto px-6 md:px-12 xl:px-6 bg-gray-100 py-12 pl-14 flex justify-center items-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-700">Error loading properties: {error}</p>
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
      <div className="w-full mx-auto px-6 md:px-12 xl:px-6 bg-gray-100 py-12 pl-8">
          <PropertySection 
              title="Pending Listed Properties" 
              properties={pendingProperties} 
              className="text-sm md:text-3xl" 
          />
          <PropertySection 
              title="Published Listed Properties" 
              properties={publishedProperties} 
              className="text-sm md:text-3xl" 
          />
      </div>
  );
}