'use client';

import Image from 'next/image';
import { useState } from 'react';

const testimonials = [
  {
    quote: "Thanks to this platform, I found my dream home in no time! The search feature made it incredibly easy to navigate through listings.",
    name: "Emeka Anara",
    title: "Homebuyer, Afikpo",
    image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1734169911/Avatar_Image_r39bym.png"
  },
  {
    quote: "QARBA made selling my property effortless. The listing process was smooth and I got genuine buyers quickly.",
    name: "Michael Okafor",
    title: "Property Seller, Lagos",
    image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167907/testimonial3.jpg"
  },
  {
    quote: "The best real estate platform I've used. Professional service and excellent customer support throughout my property search.",
    name: "Sarah Johnson",
    title: "Property Investor",
    image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1750167907/testimonial2.jpg"
  },
  {
    quote: "I found a great tenant for my apartment within days. The verification process gave me peace of mind.",
    name: "Chinwe Eze",
    title: "Landlord, Enugu",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const Section5 = () => {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const handleNext = () => setCurrent((prev) => (prev + 1) % testimonials.length);

  return (
    <section className="max-w-5xl mx-auto my-20 px-4 text-center">
      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-8">Testimonials</h3>
        <div className="text-xl font-semibold mb-6">
          &quot;{testimonials[current].quote}&quot;
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={testimonials[current].image}
            alt={testimonials[current].name}
            className="w-16 h-16 rounded-full mb-4"
            width={64}
            height={64}
          />
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
