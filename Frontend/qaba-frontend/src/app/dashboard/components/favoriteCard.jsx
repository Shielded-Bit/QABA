'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Home, Bed, Bath, SquareCode, Tag } from 'lucide-react';
import axios from 'axios';

const FavoriteCard = ({ favorite, onRemove }) => {
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
      
      // Use the toggle endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/toggle/`,
        { property_id: property.id },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      if (response.status === 200) {
        // Call the onRemove callback to update parent state
        onRemove(favorite.id);
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsRemoving(false);
    }
  };

  // If there's no property data, don't render the card
  if (!property || Object.keys(property).length === 0) {
    return null;
  }

  return (
    <Link href={`/details/${property.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
        {/* Property Image */}
        <div className="relative h-48">
          <Image
            src={property.thumbnail || '/api/placeholder/400/320'}
            alt={property.property_name || 'Property'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute top-3 right-3">
            <button
              onClick={handleRemoveFavorite}
              disabled={isRemoving}
              className={`p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors ${isRemoving ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Remove from favorites"
            >
              <Heart
                size={16}
                className={`text-red-500 ${isRemoving ? 'animate-pulse' : ''}`}
                fill="currentColor"
              />
            </button>
          </div>
          
          <div className="absolute top-3 left-3">
            <div className={`px-3 py-1 text-white text-xs font-medium rounded-full bg-gradient-to-r from-[#014d98] to-[#3ab7b1]`}>
              {property.listing_type === 'SALE' ? 'Buy' : 'Rent'}
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {property.property_name}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {property.location}
          </p>
          <div className="mt-4 text-lg font-bold text-gray-900">
            {formatPrice()}
          </div>

          {/* Property Features */}
          <div className="mt-4 flex items-center gap-4 text-gray-600 text-sm">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed size={16} />
                <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath size={16} />
                <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
            )}
            {property.area_sqft && (
              <div className="flex items-center gap-1">
                <SquareCode size={16} />
                <span>{property.area_sqft} sqft</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FavoriteCard;