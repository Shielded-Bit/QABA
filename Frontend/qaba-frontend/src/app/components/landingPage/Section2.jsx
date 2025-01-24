'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; // Import Swiper modules
import 'swiper/css';
import 'swiper/css/pagination';
import Card from '../shared/Card';

const Section2 = () => {
  const cardData = useMemo(
    () => [
      {
        logo: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734095772/Vector_3_eaqfs5.png',
        title: 'Buying and Renting of Homes',
        description:
          "Discover a wide range of houses and apartments to buy or rent that suit your lifestyle and budget. Whether you're looking for a cozy home or a spacious property, we've got you covered.",
        logoWidth: 20,
        logoHeight: 20,
      },
      {
        logo: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734095785/Group_6_zm9e8e.png',
        title: 'Property Verification',
        description:
          'We ensure that listed properties are genuine and meet all necessary requirements, giving you confidence and peace of mind when making your choice.',
        logoWidth: 30,
        logoHeight: 30,
      },
      {
        logo: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734095785/bi_house-add_mw8vxe.png',
        title: 'Listing Properties',
        description:
          'Landlords and agents can easily showcase their properties to a large audience. Upload listings with ease and reach potential buyers or tenants quickly.',
        logoWidth: 30,
        logoHeight: 30,
      },
    ],
    []
  );

  const [visibleSlides, setVisibleSlides] = useState(0);

  // Simulate cards mounting one by one
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSlides((prev) => (prev < cardData.length ? prev + 1 : prev));
    }, 500); // Adjust the delay for the reveal effect
    return () => clearInterval(interval);
  }, [cardData.length]); // Include cardData.length as a dependency

  return (
    <section className="py-12 bg-gray-50 px-4 sm:px-6 lg:pr-0 lg:pl-14">
      {/* Title and Description */}
      <div className="text-center mb-8">
        <h4 className="text-2xl font-light text-gray-800 mb-4">What we do</h4>
        <p className="text-lg text-gray-600">
  We&apos;re here to simplify your home-buying journey, offering expert guidance, personalized 
  <span className="hidden lg:inline"> <br /> </span> 
  support, and seamless service every step of the way.
</p>

      </div>

      {/* Swiper Carousel */}
      <Swiper
        spaceBetween={40} // Adjust space between cards
        slidesPerView={1}
        speed={1000} // Smooth transition speed in milliseconds
        autoplay={{
          delay: 4000, // Auto-slide every 4 seconds
          disableOnInteraction: false, // Keeps autoplay running after interaction
        }}
        pagination={{
          clickable: true,
          el: '.custom-pagination', // Custom pagination container
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40, // Increased spacing for large screens
          },
        }}
        modules={[Pagination, Autoplay]} // Register modules
      >
        {cardData.map((card, index) => (
          <SwiperSlide
            key={index}
            className={`animate-fadeIn transition-all duration-700 ease-in-out ${
              index < visibleSlides ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Card
              logo={card.logo}
              title={card.title}
              description={card.description}
              logoWidth={card.logoWidth}
              logoHeight={card.logoHeight}
            />
          </SwiperSlide>
        ))}
        {/* Custom Pagination */}
        <div className="custom-pagination"></div>
      </Swiper>
    </section>
  );
};

export default Section2;
