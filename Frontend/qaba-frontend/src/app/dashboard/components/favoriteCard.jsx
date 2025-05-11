'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Home, Bed, Bath, SquareCode, Tag } from 'lucide-react';

const FavoriteCard = ({ favorite }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Extract property data from the favorite object
  const property = favorite?.property || {};
  
  // Format price display based on listing type with Naira symbol
  const formatPrice = () => {
    if (!property) return 'N/A';
    
    if (property.listing_type === 'RENT') {
      return `₦${property.rent_price ? Number(property.rent_price).toLocaleString() : 'N/A'}${
        property.rent_frequency ? `/${property.rent_frequency.toLowerCase()}` : '/month'
      }`;
    } else {
      return property.sale_price ? `₦${Number(property.sale_price).toLocaleString()}` : 'N/A';
    }
  };
  
  // Handle removing a property from favorites
  const handleRemoveFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isRemoving) return;
    
    try {
      setIsRemoving(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await fetch(`https://qaba.onrender.com/api/v1/favorites/${favorite.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Refresh the page to show the updated favorites list
        window.location.reload();
      } else {
        console.error('Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  // If there's no property data, don't render the card
  if (!property || Object.keys(property).length === 0) {
    return null;
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Property Image - Updated to use thumbnail instead of cover_image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {property.thumbnail ? (
          <img
            src={property.thumbnail}
            alt={property.property_name || 'Property'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-300">
            <Home size={64} className="text-gray-400" />
          </div>
        )}
        
        {/* Listing Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            property.listing_type === 'RENT' 
              ? 'bg-blue-600 text-white' 
              : 'bg-green-600 text-white'
          }`}>
            {property.listing_type === 'RENT' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={handleRemoveFavorite}
          disabled={isRemoving}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-red-500 shadow-sm"
          aria-label="Remove from favorites"
        >
          {isRemoving ? (
            <div className="h-5 w-5 border-t-2 border-red-500 rounded-full animate-spin" />
          ) : (
            <Heart size={20} fill="currentColor" />
          )}
        </button>
      </div>
      
      {/* Property Content */}
      <Link href={`/details/${property.id}`} className="block p-4">
        {/* Price - Updated with Naira symbol and better formatting */}
        <div className="mb-2 font-bold text-xl text-gray-800">
          {formatPrice()}
        </div>
        
        {/* Property Name */}
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {property.property_name || 'Unnamed Property'}
        </h3>
        
        {/* Location */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {property.location || 'Location not specified'}
        </p>
        
        {/* Property Features */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath size={16} />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          
          {property.area_sqft > 0 && (
            <div className="flex items-center gap-1">
              <SquareCode size={16} />
              <span>{property.area_sqft.toLocaleString()} sqft</span>
            </div>
          )}
        </div>
        
        {/* Property Status */}
        {property.property_status && (
          <div className="mt-3 flex items-center gap-1 text-sm">
            <Tag size={14} className="text-gray-500" />
            <span className={`
              ${property.property_status === 'AVAILABLE' ? 'text-green-600' : 
                property.property_status === 'PENDING' ? 'text-orange-600' : 
                'text-gray-600'}
            `}>
              {property.property_status_display || property.property_status}
            </span>
          </div>
        )}
      </Link>
    </div>
  );
};

export default FavoriteCard;