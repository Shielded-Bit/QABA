'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/pagination';
import Card from '../shared/Card';

const Section2 = () => {
  const router = useRouter();
  
  const cardData = useMemo(
    () => [
      {
        logo: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734095772/Vector_3_eaqfs5.png',
        title: 'Buying and Renting of Homes',
        description:
          "Discover a wide range of houses and apartments to buy or rent that suit your lifestyle and budget. Whether you're looking for a cozy home or a spacious property, we've got you covered.",
        logoWidth: 24,
        logoHeight: 24,
      },
      {
        logo: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734095785/Group_6_zm9e8e.png',
        title: 'Property Verification',
        description:
          'We ensure that verified properties are genuine and meet all necessary requirements, giving you confidence and peace of mind when making your choice.',
        logoWidth: 32,
        logoHeight: 32,
      },
      {
        logo: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734095785/bi_house-add_mw8vxe.png',
        title: 'Listing Properties',
        description:
          'Landlords and agents can easily showcase their properties to a large audience. Upload listings with ease and reach potential buyers or tenants quickly.',
        logoWidth: 32,
        logoHeight: 32,
      },
    ],
    []
  );

  const [visibleSlides, setVisibleSlides] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Navigation handler
  const handleCardClick = (cardTitle) => {
    switch (cardTitle) {
      case 'Buying and Renting of Homes':
        router.push('/properties');
        break;
      case 'Property Verification':
        router.push('/properties');
        break;
      case 'Listing Properties':
        router.push('/add-listing');
        break;
      default:
        router.push('/add-listing');
    }
  };

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const sectionElement = document.getElementById('section2');
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  // Simulate cards mounting one by one when section becomes visible
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setVisibleSlides((prev) => (prev < cardData.length ? prev + 1 : prev));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isVisible, cardData.length]);

  return (
    <section 
      id="section2"
      className="py-8 md:py-16 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 px-2 md:px-14 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-full opacity-50 -translate-y-24 md:-translate-y-32 translate-x-24 md:translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-gradient-to-tr from-indigo-50 to-transparent rounded-full opacity-50 translate-y-16 md:translate-y-24 -translate-x-16 md:-translate-x-24"></div>
      
      {/* Title and Description */}
      <div className="max-w-6xl mx-auto text-center mb-8 md:mb-12 relative z-10">
        <div className={`transform transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h4 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-800 mb-4 md:mb-6 tracking-wide">
            What we do
          </h4>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-4 md:mb-6 rounded-full"></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 md:px-4">
            We simplify your home buying and rental journey by providing expert guidance, trusted property verification, and easy listing options.
          </p>
        </div>
      </div>

      {/* Enhanced Swiper Carousel */}
      <div className="max-w-6xl mx-auto relative z-10">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          speed={1000}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
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
          modules={[Pagination, Autoplay]}
        >
          {cardData.map((card, index) => (
            <SwiperSlide
              key={index}
              className={`transition-all duration-700 ease-in-out ${
                index < visibleSlides 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-12 scale-95'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col px-2">
                <div 
                  className="group cursor-pointer h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => handleCardClick(card.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(card.title);
                    }
                  }}
                  aria-label={`Navigate to add listing page for ${card.title}`}
                >
                  <Card
                    logo={card.logo}
                    title={card.title}
                    description={card.description}
                    logoWidth={card.logoWidth}
                    logoHeight={card.logoHeight}
                    isClickable={true}
                    onClick={() => handleCardClick(card.title)}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
};

export default Section2;