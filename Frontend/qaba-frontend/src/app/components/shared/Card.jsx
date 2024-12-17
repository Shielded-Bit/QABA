import React from 'react';
import Image from 'next/image';

const Card = ({ logo, title, description, logoWidth, logoHeight }) => {
  return (
    <div className="w-full max-w-96 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center h-[380px]"> {/* Increased max width */}
      {/* Logo */}
      <div className="mb-4">
        <Image 
          src={logo} 
          alt={title} 
          width={logoWidth}  // Using dynamic width
          height={logoHeight} // Using dynamic height
          style={{ objectFit: 'contain' }} 
        />
      </div>

      {/* Title */}
      <h5 className="text-1xl font-bold mb-4">{title}</h5>

      {/* Description */}
      <p className="text-gray-700 mb-6">{description}</p>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Text Link with Gradient Color */}
      <div className="mt-0">
        <a 
          href="#" 
          className="text-base font-light bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#3ab7b1]"
        >
          Learn More &gt;
        </a>
      </div>
    </div>
  );
};

export default Card;
