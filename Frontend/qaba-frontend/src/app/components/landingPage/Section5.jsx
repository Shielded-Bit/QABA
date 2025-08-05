'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const defaultAvatar = "https://ui-avatars.com/api/?name=User&background=014d98&color=ffffff&size=128&rounded=true";

const Section5 = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://qaba.onrender.com/api/v1/reviews/all/', {
          headers: {
            'accept': 'application/json',
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch reviews');
        
        const data = await response.json();
        // Take only approved reviews and map them to our testimonial format
        const approvedReviews = data
          .filter(review => review.status === 'APPROVED')
          .slice(0, 4) // Take only first 4 reviews
          .map(review => ({
            quote: review.comment,
            name: review.reviewer_name,
            title: `${review.reviewer_type}, ${review.property_name}`,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name || 'User')}&background=014d98&color=ffffff&size=128&rounded=true`, // Generate unique avatar for each user
            rating: review.rating
          }));
        
        setTestimonials(approvedReviews);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load testimonials');
        setLoading(false);
        // Fallback to empty array
        setTestimonials([]);
      }
    };

    fetchReviews();
  }, []);

  const handlePrev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const handleNext = () => setCurrent((prev) => (prev + 1) % testimonials.length);

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto my-20 px-4 text-center">
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-8">Testimonials</h3>
          <div className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg mb-6"></div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return (
      <section className="max-w-5xl mx-auto my-20 px-4 text-center">
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-8">Testimonials</h3>
          <p className="text-gray-600">No testimonials available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto my-20 px-4 text-center">
      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-8">Testimonials</h3>
        <div className="text-xl font-semibold mb-6">
          &quot;{testimonials[current].quote}&quot;
        </div>
        <div className="flex flex-col items-center">
          <div className="relative">
            <Image
              src={testimonials[current]?.image || defaultAvatar}
              alt={testimonials[current]?.name || 'Anonymous User'}
              className="w-16 h-16 rounded-full mb-4"
              width={64}
              height={64}
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
              }}
            />
            {testimonials[current].rating && (
              <div className="absolute bottom-3 right-0 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white text-xs px-2 py-1 rounded-full">
                {testimonials[current].rating}★
              </div>
            )}
          </div>
          <p className="font-bold">{testimonials[current].name}</p>
          <p className="text-gray-600">{testimonials[current].title}</p>
        </div>
        <div className="flex justify-center items-center mt-10 space-x-6">
          <button
            aria-label="Previous testimonial"
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center bg-white border rounded-full hover:bg-gray-100 transition"
          >
            &#8592;
          </button>
          <div className="flex space-x-1">
            {testimonials.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full ${idx === current ? 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1]' : 'bg-gray-300'}`}
              ></span>
            ))}
          </div>
          <button
            aria-label="Next testimonial"
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center bg-white border rounded-full hover:bg-gray-100 transition"
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Section5;
