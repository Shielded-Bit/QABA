"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://qaba.onrender.com/api/v1";

// Property types for selection
const PROPERTY_TYPES = [
  { value: "HOUSE", label: "House" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "SELF_CONTAIN", label: "Self Contain" },
  { value: "ONE_BEDROOM_FLAT", label: "One Bedroom Flat" },
  { value: "TWO_BEDROOM_FLAT", label: "Two Bedroom Flat" },
  { value: "THREE_BEDROOM_FLAT", label: "Three Bedroom Flat" },
  { value: "FOUR_BEDROOM_FLAT", label: "Four Bedroom Flat" },
  { value: "WAREHOUSE", label: "Warehouse" },
  { value: "EMPTY_LAND", label: "Empty Land" },
  { value: "LAND_WITH_BUILDING", label: "Land with Building" }
];

// Available amenities mapping
const AMENITIES_MAPPING = {
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

// Format number with commas for better readability
const formatNumberWithCommas = (value) => {
  if (!value) return '';
  const plainNumber = value.toString().replace(/[^\d]/g, '');
  return plainNumber ? plainNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
};

const EditProperty = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state with all required fields for both rent and sale
  const [formData, setFormData] = useState({
    property_name: "",
    description: "",
    property_type: "HOUSE",
    listing_type: "RENT", // Will be updated from API response
    location: "",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 0,
    rent_frequency: "MONTHLY",
    rent_price: "",
    sale_price: "",
    amenities: [],
    user_type: "owner",
    listing_status: "DRAFT",
    property_status: "AVAILABLE",
    lister_type: "LANDLOARD"
  });

  // Formatted price display states
  const [displayRentPrice, setDisplayRentPrice] = useState('');
  const [displaySalePrice, setDisplaySalePrice] = useState('');

  // Media files state
  const [mediaFiles, setMediaFiles] = useState({
    images: [],
    video: null
  });

  // Existing images from the property
  const [existingImages, setExistingImages] = useState([]);
  
  // Track images to delete
  const [imagesToDelete, setImagesToDelete] = useState([]);

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
        
        // Handle data structure to get property
        const data = response.data.property || response.data.data || response.data;
        
        // Populate form data
        setFormData({
          property_name: data.property_name || "",
          description: data.description || "",
          property_type: data.property_type || "HOUSE",
          listing_type: data.listing_type || "RENT",
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
          user_type: data.user_type || "owner",
          listing_status: data.listing_status || "DRAFT",
          property_status: data.property_status || "AVAILABLE",
          lister_type: data.lister_type || "LANDLOARD"
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
        
        toast.success('Property data loaded successfully');
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        toast.error(`Error loading property: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyData();
  }, [params.id, router]);

  // Handle input changes - FIXED VERSION
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for price fields
    if (name === 'rent_price') {
      // Only format the display value, but store the raw number
      const numericValue = value.replace(/[^\d]/g, '');
      setDisplayRentPrice(formatNumberWithCommas(numericValue));
      
      setFormData({
        ...formData,
        [name]: numericValue // Store the raw number without commas
      });
    } else if (name === 'sale_price') {
      // Only format the display value, but store the raw number
      const numericValue = value.replace(/[^\d]/g, '');
      setDisplaySalePrice(formatNumberWithCommas(numericValue));
      
      setFormData({
        ...formData,
        [name]: numericValue // Store the raw number without commas
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
      
      if (currentAmenities.includes(amenity)) {
        return {
          ...prevState,
          amenities: currentAmenities.filter(item => item !== amenity)
        };
      } else {
        return {
          ...prevState,
          amenities: [...currentAmenities, amenity]
        };
      }
    });
  };

  // Handle file uploads
  const handleFileChange = (e, fileType) => {
    if (fileType === 'images') {
      if (e.target.files.length > 0) {
        setMediaFiles({
          ...mediaFiles,
          images: [...mediaFiles.images, e.target.files[0]]
        });
        toast.success('Image selected successfully');
      }
    } else if (fileType === 'video') {
      if (e.target.files[0]) {
        setMediaFiles({
          ...mediaFiles,
          video: e.target.files[0]
        });
        toast.success('Video selected successfully');
      }
    }
  };

  // Handle removing a pending image upload
  const handleRemovePendingImage = (index) => {
    setMediaFiles(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    toast.success('Image removed from uploads');
  };

  // Handle removing existing image
  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
    toast.success('Image marked for deletion');
  };

  // Submit form - handles both draft and review
  const handleSubmit = async (isDraft = false) => {
    // Validate required fields
    const requiredFields = ['property_name', 'description', 'location'];
    
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
      
      // Create FormData for sending files
      const formDataForApi = new FormData();
      
      // Set listing status based on isDraft
      const updatedFormData = {
        ...formData,
        listing_status: isDraft ? "DRAFT" : "PENDING", // Use PENDING for review
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : 0,
      };
      
      // Add all form data to FormData
      Object.keys(updatedFormData).forEach(key => {
        if (Array.isArray(updatedFormData[key])) {
          // Handle arrays like amenities
          updatedFormData[key].forEach(value => {
            formDataForApi.append(key, value);
          });
        } else if (updatedFormData[key] !== null && updatedFormData[key] !== undefined) {
          formDataForApi.append(key, updatedFormData[key]);
        }
      });
      
      // Add images to delete
      imagesToDelete.forEach(url => {
        formDataForApi.append('images_to_delete', url);
      });
      
      // Add new images
      mediaFiles.images.forEach(image => {
        formDataForApi.append('images', image);
      });
      
      // Add video if selected
      if (mediaFiles.video) {
        formDataForApi.append('video', mediaFiles.video);
      }
      
      const accessToken = localStorage.getItem('access_token');
      
      const response = await axios.patch(
        `${API_BASE_URL}/properties/${params.id}/`, 
        formDataForApi, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      toast.dismiss();
      
      if (isDraft) {
        toast.success('Property saved as draft');
      } else {
        toast.success('Property submitted for review');
      }
      
      // Redirect to property details
      setTimeout(() => {
        router.push(`/agent-dashboard/properties/${params.id}`);
      }, 1500);
        
    } catch (error) {
      toast.dismiss();
      console.error("Error updating property:", error);
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper component for FileUploadBox
  const FileUploadBox = ({ onChange, onRemove, file, index = null }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center relative">
      {file ? (
        <>
          <div className="text-gray-500 text-center mb-2">
            <p className="truncate w-full">{file.name || "Selected file"}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Remove
          </button>
        </>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-gray-500 text-center pointer-events-none">
            <p>Upload Image</p>
          </div>
        </>
      )}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading property data...</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg py-6 md:px-6 pl-4 pr-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-normal text-[#014d98]">Edit Property</h2>
        <button
          onClick={() => router.push(`/agent-dashboard/properties/${params.id}`)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      {/* Basic Property Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-normal text-[#014d98] mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Property Name*</label>
            <input
              type="text"
              name="property_name"
              value={formData.property_name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="e.g. Greenhood House"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Property Type</label>
            <select 
              name="property_type"
              value={formData.property_type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select> 
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Listing Type</label>
            <select 
              name="listing_type"
              value={formData.listing_type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              disabled  // Disable changing listing type
            >
              <option value="RENT">For Rent</option>
              <option value="SALE">For Sale</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Listing type cannot be changed after creation
            </p>
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-normal text-[#014d98] mb-4">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conditional rendering based on property type */}
          {!formData.property_type.includes("LAND") && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">Bedrooms</label>
                <select 
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num === 5 ? "5+" : num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Bathrooms</label>
                <select 
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num === 5 ? "5+" : num}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Square Footage</label>
            <input
              type="number"
              name="area_sqft"
              value={formData.area_sqft}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Enter square footage"
            />
          </div>
        </div>
        
        {/* Price fields based on listing type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {formData.listing_type === "RENT" && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">Rent Price*</label>
                <input
                  type="text"
                  name="rent_price"
                  value={displayRentPrice}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  placeholder="e.g. 12,000,000"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Rent Frequency</label>
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
            </>
          )}

          {formData.listing_type === "SALE" && (
            <div>
              <label className="block text-gray-700 mb-2">Sale Price*</label>
              <input
                type="text"
                name="sale_price"
                value={displaySalePrice}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="e.g. 150,000,000"
              />
            </div>
          )}
        </div>
      </div>

      {/* Description and Location */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-normal text-[#014d98] mb-4">Address and Description</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Property Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md h-32"
              placeholder="Describe your property's best features"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Property Address*</label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md h-32"
              placeholder="Provide the property address"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-normal text-[#014d98] mb-4">Property Media</h3>
        
        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-normal text-gray-700 mb-3">Existing Images</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Upload New Media */}
        <div>
          <h4 className="text-lg font-normal text-gray-700 mb-3">Upload New Media</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Display pending image uploads */}
            {mediaFiles.images.map((file, index) => (
              <FileUploadBox
                key={`pending-${index}`}
                file={file}
                index={index}
                onRemove={handleRemovePendingImage}
              />
            ))}
            
            {/* Add new image button */}
            {mediaFiles.images.length < 5 && (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex items-center justify-center relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'images')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-gray-500 text-center">
                  <p>+ Add Image</p>
                </div>
              </div>
            )}
            
            {/* Video upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex items-center justify-center relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-gray-500 text-center">
                <p>{mediaFiles.video ? `Selected: ${mediaFiles.video.name}` : '+ Add Video'}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Upload high-quality images to showcase your property. You can upload up to 5 images.
          </p>
        </div>
      </div>

      {/* Features and Amenities */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-normal text-[#014d98] mb-4">Features and Amenities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.keys(AMENITIES_MAPPING).map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2 p-2 border border-transparent hover:border-gray-200 rounded-md">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              <span className="text-gray-700">{AMENITIES_MAPPING[amenity]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={submitting}
          className="border-2 border-blue-500 text-blue-500 py-2 px-6 rounded-md hover:bg-blue-100 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-6 rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
};

export default EditProperty;