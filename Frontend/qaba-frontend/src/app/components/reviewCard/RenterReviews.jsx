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
        
        // Ensure we have an array of reviews
        const reviewsArray = Array.isArray(data) ? data : data.results || [];
        
        // Transform API data to match our UI format
        const formattedReviews = reviewsArray.map(review => ({
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
        <div className="w-full h-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 p-4 rounded-lg bg-red-50 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="text-gray-500 p-4 rounded-lg bg-gray-50 mb-4">
          No reviews yet. Be the first to review this property!
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
