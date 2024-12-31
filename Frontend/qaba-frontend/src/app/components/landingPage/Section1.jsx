'use client';

import React from 'react';
import Image from 'next/image';

const Section1 = () => {
  const logos = [
    {
      src: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734020791/Group_2_cjs09w.png',
      alt: 'Logo 1',
    },
    {
      src: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734020791/Group_4_guzvnw.png',
      alt: 'Logo 2',
    },
    {
      src: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734020792/veegaland_homes_logo.png_1_qmrscw.png',
      alt: 'Logo 3',
    },
    {
      src: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734020791/sage_homes_logo.svg_m0corp.png',
      alt: 'Logo 4',
    },
    {
      src: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734083967/richmond_american_homes_logo.svg_g8idid.png',
      alt: 'Logo 5',
    },
    {
      src: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734020791/Group_5_xxida7.png',
      alt: 'Logo 6',
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      {/* Partnered With Text */}
      <p className="text-center text-lg font-light text-gray-700 mb-6">
        Partnered With
      </p>

      {/* Infinite Scroll Wrapper */}
      <div className="overflow-hidden relative">
        <div className="flex items-center gap-8 animate-scroll whitespace-nowrap">
          {/* Duplicate the logos for seamless scrolling */}
          {logos.map((logo, index) => (
            <div
              key={`original-${index}`}
              className="flex justify-center items-center w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          ))}
          {/* Duplicate for seamless infinite scrolling */}
          {logos.map((logo, index) => (
            <div
              key={`duplicate-${index}`}
              className="flex justify-center items-center w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section1;
