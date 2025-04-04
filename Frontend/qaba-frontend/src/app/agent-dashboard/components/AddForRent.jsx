"use client";
import React, { useState } from "react";
import axios from "axios";
// Import the custom modal instead of toast
import SuccessModal from "./SuccessModal"; // Make sure path is correct

// We'll assume API_BASE_URL is imported from somewhere or defined here
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://qaba.onrender.com/api/v1";

// Updated createProperty function to handle both property data and media files in a single request
const createProperty = async (data, mediaFiles) => {
  try {
    const formData = new FormData();
    
    // Add all property details to FormData
    Object.keys(data).forEach(key => {
      // Handle arrays specially (like amenities)
      if (Array.isArray(data[key])) {
        data[key].forEach(value => {
          formData.append(`${key}`, value);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    
    // Add media files to FormData
    if (mediaFiles.image1) formData.append('images', mediaFiles.image1);
    if (mediaFiles.image2) formData.append('images', mediaFiles.image2);
    if (mediaFiles.video) formData.append('video', mediaFiles.video);
    
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found. Please log in.');
    }

    const response = await axios.post(`${API_BASE_URL}/properties/`, formData, {
      headers: {
        // Don't set Content-Type when using FormData
        // Axios will automatically set it to multipart/form-data with the correct boundary
        'Authorization': `Bearer ${accessToken}`
      },
    });

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    
    // Error handling
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Failed to create property',
        errors: error.response.data?.errors || {}
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'No response received from server. Please check your network connection.'
      };
    } else {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred'
      };
    }
  }
};

const AddForRent = () => {
  // Form state
  const [formData, setFormData] = useState({
    property_name: "",
    description: "",
    property_type: "HOUSE",
    listing_type: "RENT",
    submit_for_review: false,
    location: "",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 0,
    rent_frequency: "MONTHLY",
    rent_price: "",
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
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  
  // Error modal state
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // Close the modal and reset form if needed
  const handleCloseModal = () => {
    setModalOpen(false);
    
    // If it was a final submission (not draft), reset the form
    if (!isDraft) {
      setFormData({
        property_name: "",
        description: "",
        property_type: "HOUSE",
        listing_type: "RENT",
        submit_for_review: false,
        location: "",
        bedrooms: 1,
        bathrooms: 1,
        area_sqft: 0,
        rent_frequency: "MONTHLY",
        rent_price: "",
        amenities: [],
        user_type: "owner"
      });
      
      setMediaFiles({
        image1: null,
        image2: null,
        video: null
      });
    }
  };

  // Close error modal
  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  // Updated handleSubmit function to use the new createProperty function
  const handleSubmit = async (isDraftSubmission = false) => {
    // Validate required fields
    const requiredFields = [
      'property_name', 
      'description', 
      'location', 
      'rent_price'
    ];

    const missingFields = requiredFields.filter(field => 
      !formData[field] || formData[field].trim() === ''
    );

    if (missingFields.length > 0) {
      setErrorMessage(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      setErrorModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      
      // Create payload with all necessary data
      const payload = {
        ...formData,
        submit_for_review: !isDraftSubmission,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : 0
      };
      
      console.log("Submitting data:", payload);
      
      // Use the updated createProperty function with both data and files
      const response = await createProperty(payload, mediaFiles);
        
      if (!response.success) {
        // Handle errors
        if (response.errors?.admin_user) {
          if (isDraftSubmission) {
            setIsDraft(true);
            setModalMessage('Your property has been saved as a draft locally.');
            setModalOpen(true);
            return;
          }
          
          setErrorMessage('Property submission requires admin review. Please contact support.');
          setErrorModalOpen(true);
          return;
        }
        
        throw new Error(response.message || "Failed to submit property data");
      }
      
      // Show success message
      setIsDraft(isDraftSubmission);
      if (isDraftSubmission) {
        setModalMessage('Your property has been saved as a draft. You can continue editing or view your listings.');
      } else {
        setModalMessage('Your property has been submitted for review. You will be notified when it is approved.');
      }
      setModalOpen(true);
        
    } catch (error) {
      console.error("Error submitting property:", error);
      setErrorMessage(error.message || 'Something went wrong');
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Available amenities
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
            <option value="RENT">For Rent</option>
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
          <label className="block text-gray-700">Rent Price</label>
          <input
            type="text"
            name="rent_price"
            value={formData.rent_price}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="12,000,000"
          />
        </div>

        {/* Rent Frequency */}
        <div>
          <label className="block text-gray-700">Rent Frequency</label>
          <select 
            name="rent_frequency"
            value={formData.rent_frequency}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="WEEKLY">Weekly</option>
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
              placeholder="In a couple of sentences, tell potential renters about your property's best features"
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

      {/* Success Modal */}
      <SuccessModal 
        isOpen={modalOpen}
        onClose={handleCloseModal}
        message={modalMessage}
        isDraft={isDraft}
      />
      
      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModalOpen}
        onClose={handleCloseErrorModal}
        message={errorMessage}
      />
    </div>
  );
};

// Error Modal Component
const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-11/12 max-w-md">
        <div className="flex flex-col items-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-[#014d98] mb-2">Error</h3>
          
          {/* Message */}
          <p className="text-gray-600 text-center mb-6">{message}</p>
          
          {/* Button */}
          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddForRent;