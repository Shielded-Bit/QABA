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
          'We ensure that listed properties are genuine and meet all necessary requirements, giving you confidence and peace of mind when making your choice.',
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
    // You can customize the navigation based on the card type
    // For now, all cards navigate to add-listing page
    router.push('/add-listing');
  };

  // Alternative: Navigate to different pages based on card type
  const handleSpecificCardClick = (cardTitle) => {
    switch (cardTitle) {
      case 'Buying and Renting of Homes':
        router.push('/properties'); // Or wherever you want to redirect
        break;
      case 'Property Verification':
        router.push('/verification'); // Or wherever you want to redirect
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
      className="py-16 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 px-4 sm:px-6 lg:pr-0 lg:pl-14 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-full opacity-50 -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-50 to-transparent rounded-full opacity-50 translate-y-24 -translate-x-24"></div>
      
      {/* Title and Description */}
      <div className="text-center mb-12 relative z-10">
        <div className={`transform transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h4 className="text-3xl lg:text-4xl font-light text-gray-800 mb-6 tracking-wide">
            What we do
          </h4>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We simplify your home buying and rental journey by providing expert guidance, trusted property verification, and easy listing options.
        
          </p>
        </div>
      </div>

      {/* Enhanced Swiper Carousel */}
      <div className="relative z-10">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: '.custom-pagination',
            bulletClass: 'swiper-pagination-bullet custom-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active',
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="pb-16"
        >
          {cardData.map((card, index) => (
            <SwiperSlide
              key={index}
              className={`transform transition-all duration-700 ease-out ${
                index < visibleSlides 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-12 scale-95'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
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
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Enhanced Pagination */}
        <div className="custom-pagination flex justify-center mt-8 space-x-3"></div>
      </div>

      <style jsx>{`
        .custom-bullet {
          width: 12px !important;
          height: 12px !important;
          background: #cbd5e1 !important;
          opacity: 0.6 !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
          position: relative !important;
        }
        
        .custom-bullet:hover {
          opacity: 0.8 !important;
          transform: scale(1.1) !important;
        }
        
        .custom-bullet-active {
          background: linear-gradient(45deg, #3b82f6, #6366f1) !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
        }
        
        .swiper-slide {
          height: auto !important;
        }
        
        .swiper-wrapper {
          align-items: stretch !important;
        }
        
        /* Enhanced hover effects for the entire swiper container */
        .swiper:hover {
          --swiper-pagination-color: #3b82f6;
        }
        
        /* Smooth transitions for all swiper elements */
        .swiper-slide > div {
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .swiper-slide:hover > div {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        /* Click effect */
        .swiper-slide > div:active {
          transform: translateY(-2px) scale(1.01);
        }
        
        /* Custom scrollbar for horizontal scroll on mobile */
        .swiper::-webkit-scrollbar {
          height: 4px;
        }
        
        .swiper::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        
        .swiper::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #6366f1);
          border-radius: 2px;
        }
        
        .swiper::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #4f46e5);
        }
        
        /* Focus styles for accessibility */
        .swiper-slide > div:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </section>
  );
};

export default Section2;