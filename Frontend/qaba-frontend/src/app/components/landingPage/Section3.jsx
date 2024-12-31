'use client';

import React from 'react';
import ListingCard from '../listingCard/ListingCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; // Import Swiper Autoplay
import 'swiper/css';
import 'swiper/css/pagination';
import Button from '../shared/Button';

const Section3 = () => {
  const properties = [
    {
      id: 1,
      title: 'The Dream Family Home',
      price: '₦700,000 / Year',
      description:
        "A beautiful home combining spacious living, modern features, and a prime location.",
      image:
        'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
      type: 'rent',
    },
    {
      id: 2,
      title: 'The Dream Family Home',
      price: '₦2,000,000 / Year',
      description:
        'A beautiful home combining spacious living, modern features, and a prime location.',
      image:
        'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
      type: 'rent',
    },
    {
      id: 3,
      title: 'The Dream Family Home',
      price: '₦20,000,000',
      description:
        'Luxurious home perfect for families looking for comfort and style.',
      image:
        'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
      type: 'buy',
    },
  ];

  return (
    <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Heading */}
      <h2 className="text-3xl font-bold mb-8 text-center">
        Best Properties Available
      </h2>

      {/* Swiper Carousel Container */}
      <div className="swiper-container">
        {/* Swiper with Autoplay, Pagination, and Speed */}
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          speed={1000} // Animation speed in milliseconds (smooth transition)
          autoplay={{
            delay: 4000, // Autoplay interval (slows the slide change)
            disableOnInteraction: false, // Autoplay continues after user interaction
          }}
          pagination={{
            clickable: true, // Enable clickable pagination
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          modules={[Pagination, Autoplay]} // Register Swiper modules
        >
          {properties.map((property) => (
            <SwiperSlide key={property.id}>
              <div className="animate-fadeIn"> {/* Add animation class */}
                <ListingCard {...property} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Pagination Container */}
      <div className="swiper-pagination custom-pagination mt-6" />

      {/* Button */}
      <div className="flex justify-center mt-8">
        <div className="p-4">
          <Button
            label="Load More"
            bgColor="white" // White background
            className="w-64 h-24"
          />
        </div>
      </div>
    </section>
  );
};

export default Section3;
