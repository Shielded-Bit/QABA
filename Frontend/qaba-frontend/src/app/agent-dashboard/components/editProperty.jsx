"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

const EditProperty = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // State to track images to delete
  const [imagesToDelete, setImagesToDelete] = useState([]);
  
  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://qaba.onrender.com/api/v1";
  
  // Form state
  const [formData, setFormData] = useState({
    property_name: "",
    description: "",
    property_type: "HOUSE",
    listing_type: "RENT", // Default, will be updated based on property data
    submit_for_review: false,
    location: "",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 0,
    rent_frequency: "MONTHLY",
    rent_price: "",
    sale_price: "",
    amenities: [],
    user_type: "owner"
  });

  // Formatted price display states
  const [displayRentPrice, setDisplayRentPrice] = useState('');
  const [displaySalePrice, setDisplaySalePrice] = useState('');

  // Media files state
  const [mediaFiles, setMediaFiles] = useState({
    image1: null,
    image2: null,
    video: null
  });

  // Existing images from the property
  const [existingImages, setExistingImages] = useState([]);

  // Format number with commas for better readability
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    // Remove any non-digit characters
    const plainNumber = value.toString().replace(/[^\d]/g, '');
    
    // Format with commas
    if (plainNumber) {
      return plainNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return '';
  };

  // Available amenities mapping
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

  // Fetch property data on component mount
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        
        const accessToken = localStorage.getItem('access_token');
    
        if (!accessToken) {
          toast.error('No access token found. Please log in.');
          router.push('/login');
          return;
        }
        
        const response = await axios.get(`${API_BASE_URL}/properties/${params.id}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        // Handle potential nested data structure
        const rawData = response.data;
        const data = rawData.property ? rawData.property : 
                    rawData.data ? rawData.data : 
                    rawData;
        
        // Log the raw data to debug
        console.log("Raw property data received:", data);
        
        // Populate form data
        setFormData({
          property_name: data.property_name || "",
          description: data.description || "",
          property_type: data.property_type || "HOUSE",
          listing_type: data.listing_type || "RENT",
          submit_for_review: data.submit_for_review || false,
          location: data.location || "",
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          area_sqft: data.area_sqft || 0,
          rent_frequency: data.rent_frequency || "MONTHLY",
          rent_price: data.rent_price !== undefined ? data.rent_price : "",
          sale_price: data.sale_price !== undefined ? data.sale_price : "",
          amenities: Array.isArray(data.amenities) 
            ? data.amenities.map(amenity => typeof amenity === 'string' ? amenity : amenity.name)
            : [],
          user_type: data.user_type || "owner"
        });
        
        // Format price displays
        if (data.rent_price) {
          setDisplayRentPrice(formatNumberWithCommas(data.rent_price));
        }
        
        if (data.sale_price) {
          setDisplaySalePrice(formatNumberWithCommas(data.sale_price));
        }
        
        // Set existing images
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
        }
        
        setError(null);
        toast.success('Property data loaded successfully');
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        setError(err.message);
        toast.error(`Error loading property: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyData();
  }, [params.id, API_BASE_URL, router]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for price fields
    if (name === 'rent_price') {
      // Format with commas
      const formattedValue = formatNumberWithCommas(value);
      setDisplayRentPrice(formattedValue);
      
      // Store plain number in form data
      setFormData({
        ...formData,
        [name]: formattedValue.replace(/[^\d]/g, '')
      });
    } else if (name === 'sale_price') {
      // Format with commas
      const formattedValue = formatNumberWithCommas(value);
      setDisplaySalePrice(formattedValue);
      
      // Store plain number in form data
      setFormData({
        ...formData,
        [name]: formattedValue.replace(/[^\d]/g, '')
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
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
      toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} selected successfully`);
    }
  };

  // Handle removing existing image
  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
    toast.success('Image marked for deletion');
  };

  // Updated property update function (similar to createProperty in AddForSell)
  const updateProperty = async (data, mediaFiles, propertyId) => {
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
          // Explicitly convert boolean to string for submit_for_review
          if (key === 'submit_for_review') {
            formData.append(key, data[key].toString());
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      
      // Add any images to delete
      if (imagesToDelete.length > 0) {
        imagesToDelete.forEach(url => {
          formData.append('images_to_delete', url);
        });
      }
      
      // Add media files to FormData
      if (mediaFiles.image1) formData.append('images', mediaFiles.image1);
      if (mediaFiles.image2) formData.append('images', mediaFiles.image2);
      if (mediaFiles.video) formData.append('video', mediaFiles.video);
      
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      // Debug log to confirm submit_for_review value
      console.log("Submission status:", data.submit_for_review);

      const response = await axios.patch(`${API_BASE_URL}/properties/${propertyId}/`, formData, {
        headers: {
          // Don't set Content-Type when using FormData
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
          message: error.response.data?.message || 'Failed to update property',
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

  // Handle form submission
  const handleSubmit = async (isDraft = false) => {
    // Validate required fields
    const requiredFields = [
      'property_name', 
      'description', 
      'location'
    ];
    
    // Add price field validation based on listing type
    if (formData.listing_type === 'RENT') {
      requiredFields.push('rent_price');
    } else if (formData.listing_type === 'SALE') {
      requiredFields.push('sale_price');
    }

    const missingFields = requiredFields.filter(field => 
      !formData[field] || String(formData[field]).trim() === ''
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setSubmitting(true);
      toast.loading('Updating property...');
      
      // Create payload for API
      const payload = {
        ...formData,
        // Set submit_for_review to true when NOT a draft, false when it is a draft
        submit_for_review: !isDraft,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : 0,
      };
      
      console.log("Updating property data:", payload);
      console.log("Submit for review status:", !isDraft);
      
      // Use the updateProperty function with both data and files
      const response = await updateProperty(payload, mediaFiles, params.id);
      
      if (!response.success) {
        // Handle errors
        if (response.errors?.admin_user) {
          toast.error('Property update requires admin review. Please contact support.');
          return;
        }
        
        throw new Error(response.message || "Failed to update property data");
      }
      
      // Dismiss loading toast
      toast.dismiss();
      
      // Show success message with appropriate wording
      if (isDraft) {
        toast.success('Property saved as draft');
      } else {
        toast.success('Property submitted for review');
      }
      
      // Redirect to property details page after a short delay
      setTimeout(() => {
        router.push(`/agent-dashboard/properties/${params.id}`);
      }, 1500);
        
    } catch (error) {
      toast.dismiss();
      console.error("Error updating property:", error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    // Fix: Redirect to correct property detail route
    router.push(`/agent-dashboard/properties/${params.id}`);
    toast.info('Edit cancelled');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-xl">Loading property data...</div>
    </div>;
  }

  return (
    <div className="rounded-lg py-6 md:px-6 pl-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-normal text-[#014d98]">Edit Property</h2>
        <button
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

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

        {/* Listing Type */}
        <div>
          <label className="block text-gray-700">Listing Type</label>
          <select 
            name="listing_type"
            value={formData.listing_type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            disabled  // Disable changing listing type to maintain consistency
          >
            <option value="RENT">For Rent</option>
            <option value="SALE">For Sale</option>
          </select>
          {formData.listing_type && (
            <p className="text-xs text-gray-500 mt-1">
              Listing type cannot be changed after creation
            </p>
          )}
        </div>

        {/* Number of Bedrooms - Show only if not LAND */}
        {formData.property_type !== "LAND" && (
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
        )}

        {/* Number of Bathrooms - Show only if not LAND */}
        {formData.property_type !== "LAND" && (
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
        )}

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

        {/* Rent Price - Only show if listing type is RENT */}
        {formData.listing_type === "RENT" && (
          <div>
            <label className="block text-gray-700">Rent Price</label>
            <input
              type="text"
              name="rent_price"
              value={displayRentPrice}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="12,000,000"
            />
          </div>
        )}

        {/* Sale Price - Only show if listing type is SALE */}
        {formData.listing_type === "SALE" && (
          <div>
            <label className="block text-gray-700">Sale Price</label>
            <input
              type="text"
              name="sale_price"
              value={displaySalePrice}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="150,000,000"
            />
          </div>
        )}

        {/* Rent Frequency - Only show if listing type is RENT */}
        {formData.listing_type === "RENT" && (
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
        )}
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
              placeholder="In a couple of sentences, tell potential customers about your property's best features"
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

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-normal text-[#014d98]">Existing Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative border rounded-md overflow-hidden h-48">
                <img 
                  src={imageUrl} 
                  alt={`Property image ${index+1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(imageUrl)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  aria-label="Remove image"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Media */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Upload New Media</h3>
        <p className="text-sm text-gray-600 mt-2">
          Add or replace property images and videos. Clear visuals attract more interest.
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

      {/* Submit Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={submitting}
          className="border-2 border-blue-500 text-blue-500 py-2 px-6 rounded-md hover:bg-blue-100 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save as draft'}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-6 rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit for review'}
        </button>
      </div>
    </div>
  );
};

export default EditProperty;