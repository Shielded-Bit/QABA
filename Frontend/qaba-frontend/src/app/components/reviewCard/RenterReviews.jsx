"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Enhanced Review Card Component with better styling and responsiveness
const ReviewCard = ({ rating, date, reviewText, author }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = reviewText && reviewText.length > 150;

  const toggleExpanded = () => {
    if (isLongText) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-4 sm:p-2 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      {/* Header with rating and date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 transition-colors duration-200 ${
                i < rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-200 fill-current'
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-full whitespace-nowrap">
          {date}
        </div>
      </div>
      
      {/* Review text with improved typography and expand functionality */}
      <div className="flex-grow mb-4">
        <div 
          className={`text-gray-700 text-sm sm:text-base leading-relaxed break-words ${
            isLongText ? 'cursor-pointer' : ''
          }`}
          onClick={toggleExpanded}
        >
          <p className={`transition-all duration-300 ${
            !isExpanded && isLongText 
              ? 'line-clamp-3 overflow-hidden' 
              : ''
          }`}>
            &quot;{reviewText}&quot;
          </p>
          {isLongText && (
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-flex items-center gap-1 transition-colors duration-200">
              {isExpanded ? (
                <>
                  Show less
                  <svg className="w-3 h-3 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              ) : (
                <>
                  Read more
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Author section with enhanced styling */}
      <div className="flex items-center pt-4 border-t border-gray-100 mt-auto">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-semibold">
              {author ? author.charAt(0).toUpperCase() : 'A'}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {author || 'Anonymous Reviewer'}
          </p>
          
        </div>
      </div>
    </div>
  );
};

// Enhanced skeleton with better animations
const ReviewCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm h-full flex flex-col">
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="h-5 w-14 bg-gray-200 rounded-full" />
      </div>
      
      {/* Review text skeleton */}
      <div className="flex-grow mb-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
      
      {/* Author skeleton */}
      <div className="flex items-center pt-4 border-t border-gray-100 mt-auto">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-200 rounded-full" />
        </div>
        <div className="ml-3 space-y-1">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  </div>
);

// Main component with enhanced styling
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
        console.log('API Response:', data);
        
        let reviewsArray = [];
        if (data.success && data.data && data.data.reviews) {
          reviewsArray = data.data.reviews;
        } else if (Array.isArray(data)) {
          reviewsArray = data;
        } else if (data.results) {
          reviewsArray = data.results;
        }
        
        const approvedReviews = reviewsArray.filter(review => 
          review.status === 'APPROVED'
        );
        
        const formattedReviews = approvedReviews.map(review => ({
          rating: review.rating,
          date: new Date(review.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
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

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <section className="w-full">
      {/* Header with stats */}
      {!loading && reviews.length > 0 && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-full border border-blue-100">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.round(averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-200 fill-current'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-800">{averageRating}</span>
            <span className="text-gray-600">•</span>
            <span className="text-sm text-gray-600">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
      )}

      {loading && (
        <>
          {/* Grid skeleton for larger screens */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
          {/* Swiper skeleton for mobile */}
          <div className="md:hidden space-y-4">
            {[1, 2].map((i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        </>
      )}

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-red-800 font-semibold mb-2">Unable to load reviews</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Be the first to share your experience with this property and help future renters make informed decisions!
          </p>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <>
          {/* Enhanced grid layout for larger screens */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>

          {/* Enhanced swiper for mobile screens */}
          <div className="md:hidden">
            <Swiper
              spaceBetween={20}
              slidesPerView={1.1}
              centeredSlides={false}
              speed={800}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                el: ".custom-pagination",
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              modules={[Pagination, Autoplay]}
              className="pb-12"
            >
              {reviews.map((review, index) => (
                <SwiperSlide key={index}>
                  <ReviewCard {...review} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Enhanced custom pagination */}
            <div className="custom-pagination mt-6 text-center"></div>
          </div>
        </>
      )}
      
      {/* Custom styles for Swiper pagination */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #d1d5db !important;
          opacity: 0.5 !important;
          width: 8px !important;
          height: 8px !important;
          margin: 0 4px !important;
          transition: all 0.3s ease !important;
        }
        .swiper-pagination-bullet-active {
          background: #3b82f6 !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </section>
  );
};

export default RenterReviews;