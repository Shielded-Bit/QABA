"use client";
import React from 'react';
import Image from 'next/image'; // Make sure this is properly imported if you're using Next.js
import AddPropertyInput from '../components/addPropertyInput/AddPropertyInput';



const AddListingPage = () => {
  return (
    <div className=" px-5">
      {/* Top Banner Section */}
      <div className="relative mb-8">
        {/* Top Banner */}
        <div className="relative w-full h-[410px] md:h-[550px] rounded-2xl overflow-hidden">
          {/* Background Image with Gradient */}
          <div className="absolute w-full h-full bg-gradient-to-r from-[rgba(2,79,152,0.8)] to-[rgba(56,179,176,0.2)]">
            <Image
              src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1737723125/Rectangle_133_2_sblujb.png"
              alt="Property listing background image"
              fill
              quality={90}
              priority
              className="z-[-1] object-cover"
              style={{
                objectFit: "cover",
                objectPosition: "left",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 text-white text-left px-6 sm:px-12 md:px-16 flex flex-col justify-center h-full">
            <h1 className="text-4xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-2">
              List your property for rent and <br /> buy with us
            </h1>
            <p className="text-lg sm:text-base md:text-xl leading-6 mb-4 sm:mb-2">
              Looking to rent or sell your property? Partner with us for a seamless <br />
              experience. List your property today and explore the best deals when <br />
              you buy with us.
            </p>
          </div>
        </div>

      </div>

      {/* Form Section */}
      <div className='py-16'>
      <AddPropertyInput />
      </div>
    </div>
  );
};

export default AddListingPage;
