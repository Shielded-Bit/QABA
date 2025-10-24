'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bookmark } from 'lucide-react';
import axios from 'axios';
import WatermarkedImage from '../WatermarkedImage';

const ListingCard = ({
  id,
  title,
  price,
  description,
  image,
  type,
  propertyStatus = 'Available',
  propertyTypeDisplay = '',
  amenities = []
}) => {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check initial favorite status when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        // Get the access_token (using the correct key name)
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (!token) return;
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        // Fix: Check if this property is in the user's favorites
        // Accounting for the correct data structure from API
        const favoritesData = response.data.data || [];
        
        // Look for this property in the favorites list by checking property.id against our id
        const isFavorite = favoritesData.some(fav => fav.property && fav.property.id === id);
        setIsFavorited(isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [id]);

  const handleCardClick = () => {
    router.push(`/details/${id}`);
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent card click event
    
    try {
      setIsLoading(true);
      
      // Get the access_token using the correct key name
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      // Make API request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/toggle/`,
        { property_id: id },
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      // Update favorite state based on API response
      if (response.status === 200) {
        // Toggle the favorite state
        const newState = !isFavorited;
        setIsFavorited(newState);
        
        // Store favorite state in localStorage for persistence
        // This helps maintain the state even after page refresh
        const favoriteProperties = JSON.parse(localStorage.getItem('favoriteProperties') || '{}');
        favoriteProperties[id] = newState;
        localStorage.setItem('favoriteProperties', JSON.stringify(favoriteProperties));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved favorite state from localStorage on initial load
  useEffect(() => {
    try {
      const favoriteProperties = JSON.parse(localStorage.getItem('favoriteProperties') || '{}');
      if (favoriteProperties[id] !== undefined) {
        setIsFavorited(favoriteProperties[id]);
      }
    } catch (error) {
      console.error('Error loading saved favorites:', error);
    }
  }, [id]);

  // For mobile - show tooltip on touch start and hide after delay
  const handleTouchStart = () => {
    setIsTooltipVisible(true);
    setTimeout(() => setIsTooltipVisible(false), 2000);
  };

  // Define tooltip text based on favorite status
  const tooltipText = isFavorited ? 'Remove from favorites' : 'Add to favorites';

  // Get status color based on property status
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
        return 'bg-green-500';
      case 'SOLD':
        return 'bg-red-500';
      case 'RENTED':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-md relative h-full" onClick={handleCardClick}>
      {/* Image */}
      <div className="relative p-4">
        <div className="h-64 relative">
          <WatermarkedImage
            className="w-full h-full rounded-lg object-cover"
            src={image && image.trim() !== '' ? image : '/proper.png'}
            alt={title || 'Property'}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        {/* Type and Property Type Badges */}
        <div className="absolute top-6 left-6 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
            type === 'rent' ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            {type === 'rent' ? 'Rent' : 'Buy'}
          </span>
          {propertyTypeDisplay && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
              {propertyTypeDisplay}
            </span>
          )}
        </div>

        {/* Status Badge - Top Right */}
        <div className="absolute top-6 right-6">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(propertyStatus)}`}>
            {propertyStatus}
          </span>
        </div>

        {/* Favorite Icon with Tooltip - Bottom Right */}
        <div className="absolute bottom-6 right-6">
          <button
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200 relative"
            onClick={toggleFavorite}
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
            onTouchStart={handleTouchStart}
            disabled={isLoading}
            aria-label={tooltipText}
          >
            <Bookmark 
              size={20} 
              className={`${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-500'} ${isLoading ? 'opacity-50' : ''}`} 
            />
            
            {/* Tooltip */}
            {isTooltipVisible && (
              <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                {tooltipText}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        {/* Title */}
        <div className="flex items-center">
          <h2 className="font-semibold text-lg truncate flex-1">{title}</h2>
          <Image
            src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1734106397/Vector_4_ec0tid.png"
            alt="Verified"
            width={20}
            height={20}
            className="ml-2 flex-shrink-0"
          />
        </div>
        
        {/* Description */}
        <div className="h-12 overflow-hidden">
          <p className="text-gray-600 text-sm mt-2">{description}</p>
        </div>
        
        {/* Price */}
        <p className="text-gray-900 font-bold mt-3">{price}</p>
        
        {/* Features */}
        <div className="grid grid-cols-2 gap-4 text-gray-500 text-sm mt-4">
          {amenities.slice(0, 4).map((amenity) => (
            <span key={amenity.id} className="flex items-center gap-2">
              <span>{amenity.icon}</span>
              <span className="truncate">{amenity.name}</span>
            </span>
          ))}
        </div>
      </div>
      
      {/* Action Button with Gradient Border and Text */}
      <div className="flex justify-center items-center p-4">
        <div className="rounded-md p-0.5 bg-gradient-to-r from-blue-900 to-green-600">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="w-40 h-14 bg-white rounded-md flex items-center justify-center transition-transform duration-300 ease-in-out"
            style={{ transform: isButtonHovered ? 'scale(1.02)' : 'scale(1)' }}
          >
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-green-600">
              Learn More
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;