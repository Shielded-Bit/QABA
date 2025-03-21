"use client";
import React from "react";

const AddForRent = () => {
  return (
    <div className="rounded-lg py-3">
      <h2 className="text-2xl font-normal text-[#014d98] mb-6">Property Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dropdown - What Best Describes You */}
        <div>
          <label className="block text-gray-700">What best describes you?</label>
          <select className="w-full border border-gray-300 p-2 rounded-md">
            <option value="owner">I am the property owner</option>
            <option value="agent">I am a property agent</option>
          </select>
        </div>

        {/* Property Name */}
        <div>
          <label className="block text-gray-700">Property Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Greenhood House"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-gray-700">Property Type</label>
          <select className="w-full border border-gray-300 p-2 rounded-md">
            <option value="flat">Flat</option>
            <option value="duplex">Duplex</option>
          </select>
        </div>

        {/* Number of Bedrooms */}
        <div>
          <label className="block text-gray-700">Number of Bedrooms</label>
          <select className="w-full border border-gray-300 p-2 rounded-md">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        {/* Number of Bathrooms */}
        <div>
          <label className="block text-gray-700">Number of Bathrooms</label>
          <select className="w-full border border-gray-300 p-2 rounded-md">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        {/* Listing Type */}
        <div>
          <label className="block text-gray-700">Listing Type</label>
          <select className="w-full border border-gray-300 p-2 rounded-md">
            <option value="rent">For Rent</option>
          </select>
        </div>

        {/* Square Footage */}
        <div>
          <label className="block text-gray-700">Square Footage (Optional)</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Enter square footage"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700">Price</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="12,000,000"
          />
        </div>
      </div>

      {/* Address and Description */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Address and Description</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-gray-700">Property Description</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="In a couple of sentences, tell potential renters about your property's best features"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Property Address</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="In detail, explain the address of the environment for easy navigation"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Upload Media */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Upload Media</h3>
        <p className="text-sm text-gray-600 mt-2">
          Showcase your property with high-quality images and a video. Clear visuals attract more buyers
          and increase engagement. Follow the guidelines below for the best results.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Upload Box 1 */}
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex items-center justify-center relative">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <p className="text-gray-500 text-center pointer-events-none">
              Drag and drop an image or click to upload
            </p>
          </div>
          {/* Upload Box 2 */}
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex items-center justify-center relative">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <p className="text-gray-500 text-center pointer-events-none">
              Drag and drop an image or click to upload
            </p>
          </div>
          {/* Upload Box 3 */}
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex items-center justify-center relative">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <p className="text-gray-500 text-center pointer-events-none">
              Drag and drop a video or click to upload
            </p>
          </div>
        </div>
      </div>

      {/* Features and Amenities */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Features and Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {[
            "Car Park",
            "Big Compound",
            "CCTV Camera",
            "POP Ceiling",
            "Traffic Light",
            "House Security",
            "Swimming Pool",
            "Security Door",
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

      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          className="border-2 border-blue-500 text-blue-500 py-2 px-6 rounded-md hover:bg-blue-100"
        >
          Save as draft
        </button>
        <button
          type="button"
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-6 rounded-md hover:opacity-90"
        >
          Submit for review
        </button>
      </div>
    </div>
  );
};

export default AddForRent;
