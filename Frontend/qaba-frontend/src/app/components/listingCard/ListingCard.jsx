'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bookmark } from 'lucide-react';

const ListingCard = ({ id, title, price, description, image, type }) => {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleCardClick = () => {
    router.push(`/details/${id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Prevent card click event
    setIsFavorited(!isFavorited);
    // Here, you can add logic to save favorite status to user dashboard
  };

  return (
    <div className="max-w-md bg-white rounded-lg overflow-hidden shadow-md relative h-full" onClick={handleCardClick}>
      {/* Image */}
      <div className="relative p-4">
        <div className="h-64 relative">
          <Image
            className="w-full h-full rounded-lg object-cover"
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
          />
        </div>

        {/* Type Badge */}
        <span
          className={`absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-semibold text-white ${
            type === 'rent' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          {type === 'rent' ? 'Rent' : 'Buy'}
        </span>

        {/* Favorite Icon */}
        <button
          className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
          onClick={toggleFavorite}
        >
          <Bookmark size={20} className={isFavorited ? 'text-red-500' : 'text-gray-500'} />
        </button>
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
        <div className="flex justify-between text-gray-500 text-sm mt-4">
          <span className="flex items-center">🏠 Spacious Living Area</span>
          <span className="flex items-center">🍳 Modern Kitchen</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm mt-2">
          <span className="flex items-center">🏡 Private Backyard</span>
          <span className="flex items-center">📌 Master Suite</span>
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