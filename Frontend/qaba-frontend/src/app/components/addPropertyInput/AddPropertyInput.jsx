"use client";
import React from 'react';

const AddPropertyInput = () => {
    return (
      <div className=" rounded-lg ">
         <div className="">
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-4 md:mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] to-[#014d98]">
            Lets
          </span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#014d98] via-[#3ab7b1] to-[#3ab7b1]">
            Get Started
          </span>
        </h1>
  
  
        {/* Personal Information Section */}
        <div className="space-y-6 ">
    {/* Section Header */}
    <h3 className="text-xl font-light text-gray-700">Personal Information</h3>
    
    {/* Inputs: Three per Row */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Dropdown */}
      <div>
        <label className="block text-gray-400">What best describes you?</label>
        <select className="w-full border border-gray-300 p-2 rounded-md">
          <option value="owner">I am the property owner</option>
          <option value="agent">I am a property agent</option>
        </select>
      </div>
  
      {/* First Name */}
      <div>
        <label className="block text-gray-400">First Name</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded-md font- placeholder-gray-500"
          placeholder="Jeremiah"
        />
      </div>
  
      {/* Last Name */}
      <div>
        <label className="block text-gray-400">Last Name</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded-md placeholder-gray-500"
          placeholder="Dike"
        />
      </div>
  
      {/* Email */}
      <div>
        <label className="block text-gray-400">Email</label>
        <input
          type="email"
          className="w-full border border-gray-300 p-2 rounded-md placeholder-gray-500 "
          placeholder="email@gmail.com"
        />
      </div>
  
      {/* Phone Number */}
      <div>
        <label className="block text-gray-400">Phone Number</label>
        <input
          type="tel"
          className="w-full border border-gray-300 p-2 rounded-md placeholder-gray-500"
          placeholder="+234"
        />
      </div>
  
      {/* Physical Address */}
      <div>
        <label className="block text-gray-400">Physical Address</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded-md placeholder-gray-500"
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
        <label className="block text-gray-400">Property Name</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded-md placeholder-gray-500"
          placeholder="Greenhood House"
        />
      </div>
      <div>
        <label className="block text-gray-400">Property Type</label>
        <select className="w-full border border-gray-300 p-2 rounded-md ">
          <option value="flat">Flat</option>
          <option value="duplex">Duplex</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400">Listing Type</label>
        <select className="w-full border border-gray-300 p-2 rounded-md">
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400">Number of Bedrooms</label>
        <input
          type="number"
          className="w-full border border-gray-300 p-2 rounded-md placeholder-gray-500"
          placeholder="2"
        />
      </div>
      <div>
        <label className="block text-gray-400">Number of Bathrooms</label>
        <input
          type="number"
          className="w-full border border-gray-300 p-2 rounded-md placeholder-gray-500"
          placeholder="2"
        />
      </div>
      <div>
        <label className="block text-gray-400">Square Footage (Optional)</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded-md placeholder-gray-500"
          placeholder="Enter square footage"
        />
      </div>
      <div>
        <label className="block text-gray-400">Address</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded-md placeholder-gray-500"
          placeholder="Enter property address"
        />
      </div>
      <div>
        <label className="block text-gray-400">Rent Frequency</label>
        <select className="w-full border border-gray-300 p-2 rounded-md">
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-400">Yearly Rent</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded-md placeholder-gray-500"
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
        <label className="block text-gray-400">Property Description</label>
        <textarea
          className="w-full border border-gray-300 p-3 rounded-md"
          placeholder="In a couple of sentences, tell potential renters about your property's best features"
          rows={4}
        ></textarea>
      </div>
      <div>
        <label className="block text-gray-400">Property Address</label>
        <textarea
          className="w-full border border-gray-300 p-3 rounded-md"
          placeholder="In details explain the address of the environment for easy navigation to there"
          rows={4}
        ></textarea>
      </div>
    </div>
  </div>
  
  {/* Amenities and Add Photos Section */}
<div className="mt-6 flex flex-col md:flex-row gap-6">
  {/* Amenities Section */}
  <div className="flex-1">
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
  <div className="flex-1">
    <h3 className="text-lg font-medium text-gray-700">Add Photos</h3>
    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center">
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        multiple
      />
      <div className="text-center">
        <svg
          className="w-10 h-28 text-gray-400 mx-auto"
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
   export default AddPropertyInput;