'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const bgpict = [
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737635993/Reset_password-bro_1_b4yl6r.png',
    alt: 'Background Image',
  },
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737637680/Symbol.svg_wi7kyn.png',
    alt: 'Google Logo',
  },
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737901695/hide_o70c0j.png',
    alt: 'hide password',
  },
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737901695/view_qioayd.png',
    alt: 'view password',
  },

];

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 py-10">
      <div className="flex w-full max-w-6xl h-[513px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Large Screens Section */}
        <div className="hidden lg:flex w-full">
          {/* Left Image Section */}
          <div className="lg:w-1/2 relative mt-6">
            <Image
              src={bgpict[0].src}
              alt={bgpict[0].alt}
              layout="fill"
              objectFit="cover"
              className="custom-rounded"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white ml-16 mt-11">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text text-gradient py-2">
              Reset your password
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-900">
              Enter your new password
            </p>

            <form className="mt-6">
              <div className="relative mt-1 pt-7">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-[39px]  transform -translate-y-1/2 px-2"
                >
                  <Image
                    src={showPassword ? bgpict[3].src : bgpict[2].src}
                    alt={showPassword ? bgpict[3].alt : bgpict[2].alt}
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              <div className="relative mt-9">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-2 py- peer  border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2"
                >
                  <Image
                    src={showPassword ? bgpict[3].src : bgpict[2].src}
                    alt={showPassword ? bgpict[3].alt : bgpict[2].alt}
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              

              <button
                type="submit"
                className="mt-10 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98]"
              >
                <a href="../signin">Done</a>
              </button>
            </form>
          </div>
        </div>
        {/* Mobile and Small Screens Section */}
        <div className="lg:hidden w-full">
          {/* Image Section */}
          <div className="relative w-full h-[200px] ">
            <Image
              src={bgpict[0].src}
              alt={bgpict[0].alt}
              layout="fill"
              objectFit=""
              className="rounded-bl-[2.5rem] rounded-br-[2.5rem]"
            />
          </div>

          {/* Form Section */}
          <div className="p-6 bg-white rounded-tl-[3.5rem] rounded-tr-[3.5rem]">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text text-gradient ">
              Reset your password
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-900 py-3">
              Enter your new password
            </p>
            <form className="mt-6">
              <div className="relative ">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-2 py- peer  border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2"
                >
                  <Image
                    src={showPassword ? bgpict[3].src : bgpict[2].src}
                    alt={showPassword ? bgpict[3].alt : bgpict[2].alt}
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <div className="relative mt-7">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-2 py- peer  border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2"
                >
                  <Image
                    src={showPassword ? bgpict[3].src : bgpict[2].src}
                    alt={showPassword ? bgpict[3].alt : bgpict[2].alt}
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <button
                type="submit"
                className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-md hover:opacity-90"
              >
                Done
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
