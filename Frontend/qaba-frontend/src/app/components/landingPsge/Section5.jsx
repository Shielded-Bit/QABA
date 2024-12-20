'use client';

import Image from 'next/image';

const Section5 = () => {
  return (
    <section className="max-w-5xl mx-auto my-20 px-4 text-center">
      
      <div className="mt-10">
        <h3 className="text-2xl font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1] mb-8">Testimonials</h3>
        <div className="text-xl font-semibold  mb-6">
          &quot;Thanks to this platform, I found my dream home in no time! The  <br />  search
          feature made it incredibly easy to navigate through listings.&quot;
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1734169911/Avatar_Image_r39bym.png"
            alt="User Avatar"
            className="w-16 h-16 rounded-full mb-4"
            width={64}  // Specify width for optimization
            height={64} // Specify height for optimization
          />
          <p className="font-bold">Emeka Anara</p>
          <p className="text-gray-600">Homebuyer, Afikpo</p>
        </div>
        <div className="flex justify-center items-center mt-10 space-x-6">
          <button
            aria-label="Previous testimonial"
            className="w-10 h-10 flex items-center justify-center bg-white border rounded-full hover:bg-gray-100 transition"
          >
            &#8592;
          </button>
          <div className="flex space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
          </div>
          <button
            aria-label="Next testimonial"
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
