"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { createProperty } from "@/app/utils/auth/api";

const AddForSell = () => {
  // Form state
  const [formData, setFormData] = useState({
    property_name: "",
    description: "",
    property_type: "HOUSE",
    listing_type: "SALE",
    submit_for_review: false,
    location: "",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 0,
    sale_price: "", // Changed from price to sale_price
    property_status: "New",
    amenities: [],
    user_type: "owner"
  });

  // Media files state
  const [mediaFiles, setMediaFiles] = useState({
    image1: null,
    image2: null,
    video: null
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle amenities selection
  const handleAmenityToggle = (amenity) => {
    setFormData(prevState => {
      const currentAmenities = [...prevState.amenities];
      
      // If amenity is already selected, remove it
      if (currentAmenities.includes(amenity)) {
        return {
          ...prevState,
          amenities: currentAmenities.filter(item => item !== amenity)
        };
      } 
      // Otherwise, add it
      else {
        return {
          ...prevState,
          amenities: [...currentAmenities, amenity]
        };
      }
    });
  };

  // Handle file uploads
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFiles({
        ...mediaFiles,
        [fileType]: file
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (isDraft = false) => {
    // Validate required fields
    const requiredFields = [
      'property_name', 
      'description', 
      'location', 
      'sale_price' // Updated to sale_price
    ];

    const missingFields = requiredFields.filter(field => 
      !formData[field] || formData[field].trim() === ''
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setIsLoading(true);
      
      // Create payload for API
      const payload = {
        ...formData,
        submit_for_review: !isDraft,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : 0,
        sale_price: formData.sale_price.replace(/,/g, ''), // Remove commas
        // Add a default user type if not specified for drafts
        user_type: formData.user_type || 'owner'
      };
      
      console.log("Submitting data:", payload);
      const response = await createProperty(payload);
        
      if (!response.success) {
        // More specific error handling
        if (response.errors) {
          // Display specific field errors
          const errorMessages = Object.values(response.errors)
            .flat()
            .join(', ');
          toast.error(errorMessages || "Failed to submit property data");
          return;
        }
        
        // Generic error message
        throw new Error(response.message || "Failed to submit property data");
      }
        
      const propertyId = response.data?.id;

      // If successful and there are media files, upload them
      if (propertyId) {
        const formData = new FormData();
        if (mediaFiles.image1) formData.append('images', mediaFiles.image1);
        if (mediaFiles.image2) formData.append('images', mediaFiles.image2);
        if (mediaFiles.video) formData.append('video', mediaFiles.video);
        
        // Only make the request if there are files to upload
        if (formData.has('images') || formData.has('video')) {
          const mediaResponse = await fetch(`/api/v1/properties/${propertyId}/media`, {
            method: 'POST',
            body: formData
          });
          
          if (!mediaResponse.ok) {
            // Use .text() or .json() depending on your API's response
            const mediaError = await mediaResponse.text().catch(() => 'Media upload failed');
            console.error("Media upload error:", mediaError);
            toast.warning('Property saved but media upload failed');
          }
        }
      }
      
      // Show success message
      toast.success(isDraft ? 'Property saved as draft' : 'Property submitted for review');
      
      // Reset form or redirect
      if (!isDraft) {
        // Redirect to listings or clear form
        window.location.href = '/agent-dashboard/myListings';
      }
        
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Available amenities (same as in AddForRent)
  const amenitiesMapping = {
    CAR_PARK: "Car Park",
    BIG_COMPOUND: "Big Compound",
    CCTV_CAMERA: "CCTV Camera",
    POP_CEILING: "POP Ceiling",
    TRAFFIC_LIGHT: "Traffic Light",
    HOUSE_SECURITY: "House Security",
    SWIMMING_POOL: "Swimming Pool",
    SECURITY_DOOR: "Security Door",
    BBOYS_QUARTERS: "Boys Quarters",
    GYM: "Gym",
    PARKING: "Parking",
    GARDEN: "Garden",
    OTHERS: "Others",
  };
  

  return (
    <div className="rounded-lg py-6 md:px-3">
      <h2 className="text-2xl font-normal text-[#014d98] mb-6">Property Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dropdown - What Best Describes You */}
        <div>
          <label className="block text-gray-700">What best describes you?</label>
          <select 
            name="user_type"
            value={formData.user_type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="owner">I am the property owner</option>
            <option value="agent">I am a property agent</option>
          </select>
        </div>

        {/* Property Name */}
        <div>
          <label className="block text-gray-700">Property Name</label>
          <input
            type="text"
            name="property_name"
            value={formData.property_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Greenhood House"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-gray-700">Property Type</label>
          <select 
            name="property_type"
            value={formData.property_type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="HOUSE">House</option>
            <option value="APARTMENT">Apartment</option>
            <option value="LAND">Land</option>
          </select> 
        </div>

        {/* Number of Bedrooms */}
        <div>
          <label className="block text-gray-700">Number of Bedrooms</label>
          <select 
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Number of Bathrooms */}
        <div>
          <label className="block text-gray-700">Number of Bathrooms</label>
          <select 
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Listing Type */}
        <div>
          <label className="block text-gray-700">Listing Type</label>
          <select 
            name="listing_type"
            value={formData.listing_type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="SALE">For Sale</option>
          </select>
        </div>

        {/* Square Footage */}
        <div>
          <label className="block text-gray-700">Square Footage (Optional)</label>
          <input
            type="number"
            name="area_sqft"
            value={formData.area_sqft}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Enter square footage"
          />
        </div>

        {/* Price */}
      <div>
        <label className="block text-gray-700">Sale Price</label>
        <input
          type="text"
          name="sale_price"
          value={formData.sale_price}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded-md"
          placeholder="12,000,000"
        />
      </div>

        {/* Property Status */}
        <div>
          <label className="block text-gray-700">Property Status</label>
          <select 
            name="property_status"
            value={formData.property_status}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="New">New</option>
            <option value="Under Construction">Under Construction</option>
            <option value="Ready to Move In">Ready to Move In</option>
          </select>
        </div>
      </div>

      {/* Address and Description */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Address and Description</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-gray-700">Property Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md h-32"
              placeholder="In a couple of sentences, tell potential buyers about your property's best features"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Property Address</label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md h-32"
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
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'image1')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-gray-500 text-center pointer-events-none">
              {mediaFiles.image1 ? (
                <p>Selected: {mediaFiles.image1.name}</p>
              ) : (
                <p>Drag and drop an image or click to upload</p>
              )}
            </div>
          </div>
          {/* Upload Box 2 */}
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex items-center justify-center relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'image2')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-gray-500 text-center pointer-events-none">
              {mediaFiles.image2 ? (
                <p>Selected: {mediaFiles.image2.name}</p>
              ) : (
                <p>Drag and drop an image or click to upload</p>
              )}
            </div>
          </div>
          {/* Upload Box 3 */}
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex items-center justify-center relative">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-gray-500 text-center pointer-events-none">
              {mediaFiles.video ? (
                <p>Selected: {mediaFiles.video.name}</p>
              ) : (
                <p>Drag and drop a video or click to upload</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features and Amenities */}
      <div className="mt-8">
  <h3 className="text-xl font-normal text-[#014d98]">Features and Amenities</h3>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
    {Object.keys(amenitiesMapping).map((amenity) => (
      <label key={amenity} className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={formData.amenities.includes(amenity)}
          onChange={() => handleAmenityToggle(amenity)}
        />
        <span>{amenitiesMapping[amenity]}</span>
      </label>
    ))}
  </div>
</div>


      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={isLoading}
          className="border-2 border-blue-500 text-blue-500 py-2 px-6 rounded-md hover:bg-blue-100 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save as draft'}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-6 rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit for review'}
        </button>
      </div>
    </div>
  );
};

export default AddForSell;