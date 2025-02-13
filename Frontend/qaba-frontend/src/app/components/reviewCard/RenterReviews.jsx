"use client";

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
const RenterReviews = () => {
  const reviews = [
    {
      rating: 5,
      date: "10/7/23",
      reviewText:
        "I moved in in February and management has been on it for me from dryer replacement to spot painting with no extra charge no hassle whatsoever. Plus I like how they keep up to date with filter changes and fire alarm safety. The gym is amazing and having a garbage room on each floor is a huge plus. I love it here.",
      author: "Chijioke Prince",
    },
    {
      rating: 5,
      date: "10/7/23",
      reviewText:
        "I moved in in February and management has been on it for me from dryer replacement to spot painting with no extra charge no hassle whatsoever. Plus I like how they keep up to date with filter changes and fire alarm safety. The gym is amazing and having a garbage room on each floor is a huge plus. I love it here.",
      author: "Chijioke Prince",
    },
    {
      rating: 5,
      date: "10/7/23",
      reviewText:
        "I moved in in February and management has been on it for me from dryer replacement to spot painting with no extra charge no hassle whatsoever. Plus I like how they keep up to date with filter changes and fire alarm safety. The gym is amazing and having a garbage room on each floor is a huge plus. I love it here.",
      author: "Chijioke Prince",
    },
  ];

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold mb-6">Renter Reviews</h2>

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
    </section>
  );
};

export default RenterReviews;
