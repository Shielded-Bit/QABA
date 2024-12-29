"use client";
import React from 'react';
import Image from 'next/image'; // Make sure this is properly imported if you're using Next.js
import Button from '../components/shared/Button';

const AddPropertyInput = () => {
  return (
    <div className=" rounded-lg ">
       <div className="">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Let's get started</h2>

      {/* Personal Information Section */}
      <div className="space-y-4">
  {/* Section Header */}
  <h3 className="text-lg font-medium text-gray-700">Personal Information</h3>
  
  {/* Inputs: Three per Row */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {/* Dropdown */}
    <div>
      <label className="block text-gray-600">What best describes you?</label>
      <select className="w-full border border-gray-300 p-2 rounded-md">
        <option value="owner">I am the property owner</option>
        <option value="agent">I am a property agent</option>
      </select>
    </div>

    {/* First Name */}
    <div>
      <label className="block text-gray-600">First Name</label>
      <input
        type="text"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="Jeremiah"
      />
    </div>

    {/* Last Name */}
    <div>
      <label className="block text-gray-600">Last Name</label>
      <input
        type="text"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="Dike"
      />
    </div>

    {/* Email */}
    <div>
      <label className="block text-gray-600">Email</label>
      <input
        type="email"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="email@gmail.com"
      />
    </div>

    {/* Phone Number */}
    <div>
      <label className="block text-gray-600">Phone Number</label>
      <input
        type="tel"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="+234"
      />
    </div>

    {/* Physical Address */}
    <div>
      <label className="block text-gray-600">Physical Address</label>
      <input
        type="text"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="Enter address"
      />
    </div>
  </div>
</div>

     {/* Property Details Section */}
<div className="mt-6 space-y-4">
  <h3 className="text-lg font-medium text-gray-700">Property Details</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-gray-600">Property Name</label>
      <input
        type="text"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="Greenhood House"
      />
    </div>
    <div>
      <label className="block text-gray-600">Property Type</label>
      <select className="w-full border border-gray-300 p-2 rounded-md">
        <option value="flat">Flat</option>
        <option value="duplex">Duplex</option>
      </select>
    </div>
    <div>
      <label className="block text-gray-600">Listing Type</label>
      <select className="w-full border border-gray-300 p-2 rounded-md">
        <option value="rent">For Rent</option>
        <option value="sale">For Sale</option>
      </select>
    </div>
    <div>
      <label className="block text-gray-600">Number of Bedrooms</label>
      <input
        type="number"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="2"
      />
    </div>
    <div>
      <label className="block text-gray-600">Number of Bathrooms</label>
      <input
        type="number"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="2"
      />
    </div>
    <div>
      <label className="block text-gray-600">Square Footage (Optional)</label>
      <input
        type="text"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="Enter square footage"
      />
    </div>
    <div>
      <label className="block text-gray-600">Address</label>
      <input
        type="text"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="Enter property address"
      />
    </div>
    <div>
      <label className="block text-gray-600">Rent Frequency</label>
      <select className="w-full border border-gray-300 p-2 rounded-md">
        <option value="yearly">Yearly</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>
    <div>
      <label className="block text-gray-600">Yearly Rent</label>
      <input
        type="text"
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="1,200,000"
      />
    </div>
  </div>
</div>


    
     {/* Property Details Section */}
<div className="mt-6 space-y-4">
  <h3 className="text-lg font-medium text-gray-700">Property Details</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-600">Property Description</label>
      <textarea
        className="w-full border border-gray-300 p-3 rounded-md"
        placeholder="In a couple of sentences, tell potential renters about your property's best features"
        rows={4}
      ></textarea>
    </div>
    <div>
      <label className="block text-gray-600">Property Address</label>
      <textarea
        className="w-full border border-gray-300 p-3 rounded-md"
        placeholder="In details explain the address of the environment for easy navigation to there"
        rows={4}
      ></textarea>
    </div>
  </div>
</div>

{/* Amenities Section */}
<div className="mt-6">
  <h3 className="text-lg font-medium text-gray-700">Amenities</h3>
  <p className="text-sm text-gray-500">List your property amenities</p>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
    {[
      "Car Park",
      "POP Ceiling",
      "House Security",
      "Swimming Pool",
      "Security Door",
      "Big Compound",
      "Traffic Light",
      "CCTV Camera",
      "Boys Quarters",
      "Others",
    ].map((amenity, index) => (
      <label key={index} className="flex items-center space-x-2">
        <input type="checkbox" className="h-4 w-4" />
        <span>{amenity}</span>
      </label>
    ))}
  </div>
</div>

{/* Add Photos Section */}
<div className="mt-6">
  <h3 className="text-lg font-medium text-gray-700">Add Photos</h3>
  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center">
    <input
      type="file"
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      multiple
    />
    <div className="text-center">
      <svg
        className="w-10 h-10 text-gray-400 mx-auto"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16v-1a4 4 0 014-4h10a4 4 0 014 4v1M16 7l-4-4m0 0L8 7m4-4v12"
        ></path>
      </svg>
      <p className="text-gray-500 mt-2">Drag and drop file here or click to upload</p>
    </div>
  </div>
</div>

{/* Save Button */}
<div className="mt-6">
  <button
    type="button"
    className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-6 rounded-md"
  >
    Save
  </button>
</div>

    </div>
      {/* Same as the previous form structure */}
    </div>
  );
};

const AddListingPage = () => {
  return (
    <div className=" ">
      {/* Top Banner Section */}
      <div className="relative mb-8">
        {/* Top Banner */}
        <div className="relative w-full h-[410px] md:h-[550px] rounded-2xl overflow-hidden">
          {/* Background Image with Gradient */}
          <div className="absolute w-full h-full bg-gradient-to-r from-[rgba(2,79,152,0.8)] to-[rgba(56,179,176,0.2)]">
            <Image
              src="https://res.cloudinary.com/dqbbm0guw/image/upload/v1735199273/Rectangle_133_igi92o.png"
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
