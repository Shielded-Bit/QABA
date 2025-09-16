"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AddListingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner Section */}
      <div className="relative h-80 md:h-96">
        {/* Background Image with Gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#014d98]/80 to-[#3ab7b1]/80 z-10"></div>
          <Image
            src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1737723125/Rectangle_133_2_sblujb.png"
            alt="Luxury property banner"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-20 flex flex-col justify-center h-full max-w-6xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            List your property with us for rent or for sale
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl">
            Looking to rent or sell your property? Partner with us for a seamless
            experience. List your property today and explore the best deals.
          </p>
        </div>
      </div>
      
      {/* Registration Required Message */}
      <div className="px-4 sm:px-6 lg:px-14 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left Column - Icon/Image */}
            <div className="bg-gradient-to-r from-[#014d98]/10 to-[#3ab7b1]/10 md:w-1/3 flex items-center justify-center p-8">
  <div className="text-center">
    <div className="flex justify-center mb-6">
      <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#014d98" />
            <stop offset="100%" stopColor="#3ab7b1" />
          </linearGradient>
        </defs>
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          stroke="url(#icon-gradient)"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Property Management</h3>
    <p className="text-gray-600">Manage all your properties from one convenient dashboard</p>
  </div>
</div>
            
            {/* Right Column - Content */}
            <div className="md:w-2/3 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Add your property and experience an exciting approach to real estate.</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-[#3ab7b1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">List your properties</h3>
                    <p className="mt-1 text-gray-600">Create attractive property listings with unlimited photos</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-[#3ab7b1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Reach qualified buyers and renters</h3>
                    <p className="mt-1 text-gray-600">Connect with interested clients through our verified platform</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-[#3ab7b1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Track performance analytics</h3>
                    <p className="mt-1 text-gray-600">Monitor views, inquiries, and engagement with your listings</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex flex-col space-y-4">
                <Link
                  href="/create-account"
                  className="inline-flex justify-center items-center py-3 px-5 text-base font-medium rounded-md text-white bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:opacity-90 transition"
                >
                  Create an account
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex justify-center items-center py-3 px-5 text-base font-medium rounded-md text-white bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:opacity-90 transition"
                >
                  Log in
                </Link>
              </div>
              
              <p className="mt-6 text-center text-sm text-gray-500">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="font-medium text-[#014d98] hover:text-[#3ab7b1]">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-medium text-[#014d98] hover:text-[#3ab7b1]">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Trust Factors Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Why thousands of property owners trust us</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <svg className="w-12 h-12" fill="none" stroke="url(#gradient1)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#014d98" />
                      <stop offset="100%" stopColor="#3ab7b1" />
                    </linearGradient>
                  </defs>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Results</h3>
              <p className="text-gray-600">Our listings receive 5x more views than traditional platforms, helping you rent or sell faster.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <svg className="w-12 h-12" fill="none" stroke="url(#gradient2)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#014d98" />
                      <stop offset="100%" stopColor="#3ab7b1" />
                    </linearGradient>
                  </defs>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Client verification system ensures you only deal with legitimate inquiries and serious buyers.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <svg className="w-12 h-12" fill="none" stroke="url(#gradient3)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#014d98" />
                      <stop offset="100%" stopColor="#3ab7b1" />
                    </linearGradient>
                  </defs>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dedicated Support</h3>
              <p className="text-gray-600">Our property specialists are available 7 days a week to assist with your listing needs.</p>
            </div>
          </div>
        </div>
        

        
        {/* Final CTA */}
        <div className="mt-16 text-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#014d98]/10 to-[#3ab7b1]/10 rounded-xl">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ready to list your property?
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Join thousands of satisfied property owners who have successfully listed with us.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/create-account" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:opacity-90 md:py-4 md:text-lg md:px-10">
              Create your free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListingPage;