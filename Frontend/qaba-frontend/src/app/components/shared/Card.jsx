import React from 'react';
import Image from 'next/image';

const Card = ({ logo, title, description, logoWidth, logoHeight }) => {
  return (
    <div
      className="w-full max-w-96 shadow-lg rounded-lg p-6 flex flex-col items-center text-center h-[380px] relative overflow-hidden"
      style={{
        backgroundImage: "url('/card-bg.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for subtlety, reduced opacity */}
      <div className="absolute inset-0 pointer-events-none" style={{background: 'rgba(255,255,255,0.35)'}} />
      {/* Logo */}
      <div className="mb-4 z-10">
        <Image 
          src={logo} 
          alt={title} 
          width={logoWidth}  // Using dynamic width
          height={logoHeight} // Using dynamic height
          style={{ objectFit: 'contain' }} 
        />
      </div>

      {/* Title */}
      <h5 className="text-1xl font-bold mb-4 z-10">{title}</h5>

      {/* Description */}
      <p className="text-gray-700 mb-6 z-10">{description}</p>

      {/* Spacer */}
      <div className="flex-grow z-10"></div>

      {/* Text Link with Gradient Color */}
      <div className="mt-0 z-10">
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
