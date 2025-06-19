"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Review Card Component (No Changes)
const ReviewCard = ({ rating, date, reviewText, author }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="flex items-center text-blue-500 mb-2">
        <span>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
        <span className="ml-2 text-gray-600">{date}</span>
      </div>
      <p className="text-gray-700">{reviewText}</p>
      <p className="italic font-semibold mt-4">{author}</p>
    </div>
  );
};

// Skeleton for loading state
const ReviewCardSkeleton = () => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-md animate-pulse">
    <div className="flex items-center mb-2">
      <div className="h-5 w-24 bg-gray-300 rounded mr-2" />
      <div className="h-4 w-16 bg-gray-200 rounded" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
    <div className="h-4 bg-gray-300 rounded w-1/3" />
  </div>
);

// RenterReviews Section with Pagination
const RenterReviews = ({ property }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!property?.id) return;
      
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.log('No auth token found');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews/property/${property.id}/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        // Updated to handle the correct API response structure
        let reviewsArray = [];
        if (data.success && data.data && data.data.reviews) {
          reviewsArray = data.data.reviews;
        } else if (Array.isArray(data)) {
          reviewsArray = data;
        } else if (data.results) {
          reviewsArray = data.results;
        }
        
        // Filter only approved reviews (extra safety check)
        const approvedReviews = reviewsArray.filter(review => 
          review.status === 'APPROVED'
        );
        
        // Transform API data to match our UI format
        const formattedReviews = approvedReviews.map(review => ({
          rating: review.rating,
          date: new Date(review.created_at).toLocaleDateString(),
          reviewText: review.comment,
          author: review.reviewer_name || 'Anonymous'
        }));

        setReviews(formattedReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [property?.id]);

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold mb-6">Renter Reviews</h2>

      {loading && (
        <>
          {/* Grid skeleton for larger screens */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
          {/* Swiper skeleton for mobile */}
          <div className="md:hidden">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              speed={800}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true, el: ".custom-pagination" }}
              modules={[Pagination, Autoplay]}
            >
              <SwiperSlide>
                <ReviewCardSkeleton />
              </SwiperSlide>
            </Swiper>
            <div className="custom-pagination mt-4 text-center"></div>
          </div>
        </>
      )}

      {error && (
        <div className="text-red-500 p-4 rounded-lg bg-red-50 mb-4">
          Error loading reviews: {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="text-gray-500 p-4 rounded-lg bg-gray-50 mb-4">
          No approved reviews yet. Be the first to review this property!
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <>
          {/* Grid layout for larger screens */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {reviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>

          {/* Swiper Pagination for Small Screens */}
          <div className="md:hidden">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              speed={800}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                el: ".custom-pagination",
              }}
              modules={[Pagination, Autoplay]}
            >
              {reviews.map((review, index) => (
                <SwiperSlide key={index}>
                  <ReviewCard {...review} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Pagination */}
            <div className="custom-pagination mt-4 text-center"></div>
          </div>
        </>
      )}
    </section>
  );
};

export default RenterReviews;