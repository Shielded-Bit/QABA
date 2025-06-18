'use client';

import React, { useState, useEffect } from 'react';
import ListingCard from '../listingCard/ListingCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Button from '../shared/Button';
import { PropertyCardSkeleton } from '../../agent-dashboard/favourites/components/LoadingSkeletons';

const Section3 = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to extract and format price from property data
  const extractPrice = (property) => {
    let price = null;
    let formattedPrice = "";
    
    // For rent properties
    if (property.listing_type === "RENT") {
      price = property.rent_price;
      if (price) {
        formattedPrice = `₦${Number(price).toLocaleString()} / ${property.rent_frequency === "MONTHLY" ? "Month" : "Year"}`;
      }
    } 
    // For sale properties
    else if (property.listing_type === "SALE") {
      price = property.sale_price;
      if (price) {
        formattedPrice = `₦${Number(price).toLocaleString()}`;
      }
    }
    
    return formattedPrice || "Price on request";
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://qaba.onrender.com/api/v1/properties/?listing_status=APPROVED', {
          headers: {
            'accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const responseData = await response.json();
        
        // Extract the data array based on the actual API response structure
        const propertiesData = responseData.data || [];
        
        // Filter for sale and for rent properties
        const saleProperties = propertiesData.filter(property => 
          property.listing_type === 'SALE'
        ).slice(0, 2);
        
        const rentProperties = propertiesData.filter(property => 
          property.listing_type === 'RENT'
        ).slice(0, 1);
        
        // Combine the filtered properties
        const featuredProperties = [...saleProperties, ...rentProperties];
        
        // Map API data to our component's expected format
        const formattedProperties = featuredProperties.map(property => ({
          id: property.id,
          title: property.property_name || 'Beautiful Property',
          price: extractPrice(property),
          description: `${property.bedrooms || 0} bed, ${property.bathrooms || 0} bath property in ${property.location || 'premium location'}`,
          image: property.thumbnail || 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
          type: property.listing_type === 'RENT' ? 'rent' : 'buy'
        }));
        
        setProperties(formattedProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
        // Use fallback properties if API fails
        setProperties([
          {
            id: 1,
            title: 'The Dream Family Home',
            price: '₦700,000,000 / Year',
            description: "A beautiful home combining spacious living, modern features, and a prime location.",
            image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            type: 'rent',
          },
          {
            id: 2,
            title: 'Luxury Villa',
            price: '₦20,000,000',
            description: 'Luxurious home perfect for families looking for comfort and style.',
            image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            type: 'buy',
          },
          {
            id: 3,
            title: 'Modern Apartment',
            price: '₦25,000,000',
            description: 'Contemporary design with premium amenities in a sought-after location.',
            image: 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734105941/Cliff_house_design_by_THE_LINE_visualization_1_1_ghvctf.png',
            type: 'buy',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section className="bg-gray-50 px-6 sm:px-12 py-16">
      {/* Section Heading */}
      <h2 className="text-3xl font-bold mb-8 text-center">
        Best Properties Available
      </h2>

      {/* Loading State - Use Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, idx) => (
            <PropertyCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center text-red-500 mb-4">
          {error}
        </div>
      )}

      {/* Swiper Carousel Container */}
      {!loading && properties.length > 0 && (
        <div className="swiper-container">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            speed={1000}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
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
            modules={[Pagination, Autoplay]}
          >
            {properties.map((property) => (
              <SwiperSlide key={property.id}>
                <div className="animate-fadeIn">
                  <ListingCard {...property} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Pagination Container */}
      <div className="swiper-pagination custom-pagination mt-6" />

      {/* Button */}
      <div className="flex justify-center mt-8">
        {/* <div className="p-4">
          <Button
            label="Load More"
            bgColor="white"
            className="w-64 h-24"
          />
        </div> */}
      </div>
    </section>
  );
};

export default Section3;