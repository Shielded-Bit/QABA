'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { useState } from 'react';

const PropertyCard = ({ property, onRemove }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePropertyClick = () => {
    if (property && property.id) {
      router.push(`/details/${property.id}`);
    }
  };

  const handleRemoveFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onRemove(property.id);
    } finally {
      setIsLoading(false);
    }
  };

  if (!property) return null;

  return (
    <div 
      onClick={handlePropertyClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative h-48">
        <Image 
          src={property.thumbnail || "/api/placeholder/400/320"} 
          alt={property.property_name} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <div className={`px-3 py-1 text-white text-xs font-medium rounded-full 
            bg-gradient-to-r from-[#014d98] to-[#3ab7b1]`}
          >
            {property.listing_type === 'SALE' ? 'Buy' : 'Rent'}
          </div>
        </div>
        <button 
          onClick={handleRemoveFavorite}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Remove from favorites"
        >
          <Bookmark 
            size={16} 
            className={`text-[#014d98] fill-[#014d98] ${isLoading ? 'animate-pulse' : ''}`} 
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{property.property_name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {property.property_type_display} • {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''} • {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
          <br/>{property.location}
        </p>
        <div className="mt-3 font-bold text-lg text-[#014d98]">
          ₦{property.listing_type === 'SALE' 
              ? Number(property.sale_price).toLocaleString() 
              : `${Number(property.rent_price).toLocaleString()}/${property.rent_frequency_display || 'month'}`
          }
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
