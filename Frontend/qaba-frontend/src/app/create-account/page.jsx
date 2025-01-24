'use client';
import React from 'react';
import Image from 'next/image';

const bgpict = [
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737636958/Rectangle_178_uh827c.png',
    alt: 'Background Image',
  },
  {
    src: 'https://res.cloudinary.com/ddzaww11y/image/upload/v1737637680/Symbol.svg_wi7kyn.png',
    alt: 'Google Logo',
  },
];

const SignIn = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 py-10">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden ">
        {/* Large Screens Section */}
        <div className="hidden lg:flex w-full">
          {/* Left Image Section */}
          <div className="lg:w-1/2 relative">
            <Image
              src={bgpict[0].src}
              alt={bgpict[0].alt}
              layout="fill"
              objectFit="cover"
              className="custom-rounded"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white ml-16">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text text-gradient py-3">
              Create an account
            </h2>
            <p className="mt-2 text-sm font-bold text-gray-900 py-3">
            Register with us so that you can buy and rent with us at 
              <br className="md:block" />
              your convenience
            </p>

            <form className="mt-6">
              <div className="mt-1 pt-1">
                <input
                  type="email"
                  id="email"
                  className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="mt-1 pt-7">
                <input
                  type="password"
                  id="password"
                  className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="mt-1 pt-7">
                <input
                  type="password"
                  id="password"
                  className="px-2 peer w-full border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <div className="px-2">
                <h2 className="text-sm mt-3 font-bold text-gray-800 mb-4">Please select your role:</h2>
                <div className="space-y-3">
                  {/* Client Option */}
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="client"
                      className="w-4 h-4 text-gradient "
                    />
                    <span className="text-[16px] font-medium text-gray-900">Client:</span>
                    <span className="text-sm text-gray-500">Choose this if you’re looking to access services</span>
                  </label>

                  {/* Agent Option */}
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="agent"
                      className="w-4 h-4 text-gradient border-gray-300"
                      defaultChecked
                    />
                    <span className="text-[16px] font-medium text-gray-900">Agent:</span>
                    <span className="text-sm text-gray-500">Choose this if you’re offering services</span>
                  </label>
                </div>
              </div>

              

              <button
                type="submit"
                className="mt-10 w-full rounded-md bg-gradient-to-r from-[#014d98] to-[#3ab7b1] px-4 py-2 text-white transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98]"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-9 text-left text-sm text-gray-600">
              Already have an account {''}
              <a href="signin" className="text-gradient hover:underline">
                Sign in
              </a>
            </p>

            <div className="mt-10 flex items-center justify-center space-x-2">
              <div className="h-px w-40 bg-gray-300"></div>
              <span className="text-sm text-gray-400">Or Sign in with</span>
              <div className="h-px w-40 bg-gray-300"></div>
            </div>

            <button
              type="button"
              className="mt-10 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-200 transition-all duration-300"
            >
              <img
                src={bgpict[1].src}
                alt={bgpict[1].alt}
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>

            <p className="mt-6 text-left text-xs text-gray-900">
              By signing in you accept our{' '}
              <a href="#" className="font-extrabold">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="font-extrabold">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Mobile and Small Screens Section */}
        <div className="lg:hidden w-full ">
          {/* Image Section */}
          <div className="relative w-full h-64">
            <Image
              src={bgpict[0].src}
              alt={bgpict[0].alt}
              layout="fill"
              objectFit="cover"
              className="rounded-bl-[2.5rem] rounded-br-[2.5rem]"
            />
          </div>

          {/* Form Section */}
          <div className="p-5 bg-white rounded-tl-[3.5rem] rounded-tr-[3.5rem] ">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text text-gradient py-2"> Create an account</h2>
            <p className=" text-sm font-bold text-gray-900 py-1">
              Register with us so that you can buy and rent with us at your convenience
            </p>

            <form className="mt-6">
              <div className="mt-4">
                <input
                  type="email"
                  id="email"
                  className="w-full px-2 py- peer  border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="mt-9">
                <input
                  type="password"
                  id="password"
                  className="w-full px-2 py- peer  border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="mt-9">
                <input
                  type="password"
                  id="password"
                  className="w-full px-2 py- peer  border-b-2 border-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-transparent text-gray-900 text-sm pb-1 focus:outline-none focus:border-blue-600"
                  placeholder="Confirm password"
                  required
                />
              </div>

              <div className="">
                <h2 className="text-sm mt-3 font-bold text-gray-800 mb-4">Please select your role:</h2>
                <div className="space-y-3">
                  {/* Client Option */}
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="client"
                      className="w-4 h-4 text-gradient "
                    />
                    <span className="text-[16px] font-medium text-gray-900">Client:</span>
                    <span className="text-xs text-gray-500">Choose this if you’re looking to access services</span>
                  </label>

                  {/* Agent Option */}
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="agent"
                      className="w-4 h-4 text-gradient border-gray-300"
                      defaultChecked
                    />
                    <span className="text-[16px] font-medium text-gray-900">Agent:</span>
                    <span className="text-xs text-gray-500">Choose this if you’re offering services</span>
                  </label>
                </div>
              </div>


              <button
                type="submit"
                className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-md hover:opacity-90"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-9 text-left text-sm text-gray-600">
              Already have an account {''}
              <a href="signin" className="text-gradient hover:underline">
                Sign in
              </a>
            </p>

            <div className="mt-10 flex items-center justify-center space-x-2">
              <div className="h-px w-24 bg-gray-300"></div>
              <span className="text-sm px-1 text-gray-400">Or Sign in with</span>
              <div className="h-px w-24 bg-gray-300"></div>
            </div>
            
            <button
              type="button"
              className="mt-8 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-200 transition-all duration-300"
            >
              <img
                src={bgpict[1].src}
                alt={bgpict[1].alt}
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>

            <p className="mt-6 text-left text-xs text-gray-900">
              By signing in you accept our{' '}
              <a href="#" className="font-extrabold">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="font-extrabold">
                Privacy Policy
              </a>
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
