"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

const EditProperty = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

  // Get authenticated user type from localStorage (matching AddForRent)
  const getAuthenticatedUserType = () => {
    if (typeof window !== 'undefined') {
      const userType = localStorage.getItem('user_type');
      // Convert LANDLORD to landlord and AGENT to agent for form compatibility
      if (userType === 'LANDLORD') return 'landlord';
      if (userType === 'AGENT') return 'agent';
      return 'landlord'; // Default fallback
    }
    return 'landlord';
  };
  
  // Form state with minimal required fields
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
    user_type: getAuthenticatedUserType(), // Set based on authenticated user, not property data
    // Fields from your API example
    listing_status: "DRAFT",
    property_status: "AVAILABLE",
    lister_type: "LANDLOARD"
  });

  // Formatted price display states
  const [displayRentPrice, setDisplayRentPrice] = useState('');
  const [displaySalePrice, setDisplaySalePrice] = useState('');

  // Fee calculation state
  const [fees, setFees] = useState({
    basePrice: 0,
    agentFee: 0,
    qarbaFee: 0,
    totalFee: 0,
    totalPrice: 0
  });

  // Media files state - matching AddForRent structure
  const [mediaFiles, setMediaFiles] = useState({
    image1: null,
    image2: null,
    video: null
  });

  // Existing images from the property
  const [existingImages, setExistingImages] = useState([]);

  // Track images to delete
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Format number with commas for better readability
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    const plainNumber = value.toString().replace(/[^\d]/g, '');
    return plainNumber ? plainNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  };

  // Calculate fees based on user type and price
  const calculateFees = (userType, price) => {
    const parsedPrice = parseInt(price, 10) || 0;

    if (userType === 'agent') {
      const agentFee = Math.round(parsedPrice * 0.10); // 10%
      const qarbaFee = Math.round(parsedPrice * 0.05); // 5%
      return {
        basePrice: parsedPrice,
        agentFee,
        qarbaFee,
        totalFee: agentFee + qarbaFee,
        totalPrice: parsedPrice + agentFee + qarbaFee
      };
    } else {
      const qarbaFee = Math.round(parsedPrice * 0.05); // 5%
      return {
        basePrice: parsedPrice,
        agentFee: 0,
        qarbaFee,
        totalFee: qarbaFee,
        totalPrice: parsedPrice + qarbaFee
      };
    }
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
        
        // Handle data structure to get property
        const data = response.data.property || response.data.data || response.data;
        
        // Populate form data - use authenticated user type, not stored property data
        const authenticatedUserType = getAuthenticatedUserType();
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
          user_type: authenticatedUserType, // Always use authenticated user type
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
        
        // Set existing images - extract URLs properly
        if (data.images && data.images.length > 0) {
          const imageUrls = data.images.map(img => {
            // Handle both string URLs and objects with image_url property
            if (typeof img === 'string') return img;
            if (img && img.image_url) return img.image_url;
            return null;
          }).filter(Boolean);
          setExistingImages(imageUrls);
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
  }, [params.id, API_BASE_URL, router]);

  // Ensure user type stays in sync with authenticated user (matching AddForRent)
  useEffect(() => {
    const currentAuthUserType = getAuthenticatedUserType();
    if (formData.user_type !== currentAuthUserType) {
      setFormData(prev => ({ ...prev, user_type: currentAuthUserType }));
    }
  }, [formData.user_type]);

  // Calculate fees when price or user type changes
  useEffect(() => {
    if (formData.listing_type === 'RENT' && formData.rent_price) {
      const calculatedFees = calculateFees(formData.user_type, formData.rent_price);
      setFees(calculatedFees);
    } else if (formData.listing_type === 'SALE' && formData.sale_price) {
      const calculatedFees = calculateFees(formData.user_type, formData.sale_price);
      setFees(calculatedFees);
    }
  }, [formData.user_type, formData.rent_price, formData.sale_price, formData.listing_type]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for price fields
    if (name === 'rent_price') {
      const formattedValue = formatNumberWithCommas(value);
      setDisplayRentPrice(formattedValue);
      
      setFormData({
        ...formData,
        [name]: formattedValue.replace(/[^\d]/g, '')
      });
    } else if (name === 'sale_price') {
      const formattedValue = formatNumberWithCommas(value);
      setDisplaySalePrice(formattedValue);
      
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

  // Handle file uploads - matching AddForRent structure
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
      
      // Set listing status based on isDraft and calculate total_price
      const updatedFormData = {
        ...formData,
        listing_status: isDraft ? "DRAFT" : "PENDING", // Use PENDING for review
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : 0,
        total_price: fees.totalPrice.toString() // Add calculated total_price
      };
      
      // Add all form data to FormData
      Object.keys(updatedFormData).forEach(key => {
        if (key === 'amenities' && Array.isArray(updatedFormData[key])) {
          // Handle amenities array - send each amenity key separately
          updatedFormData[key].forEach(value => {
            formDataForApi.append('amenities', value);
          });
        } else if (Array.isArray(updatedFormData[key])) {
          // Handle other arrays
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

      // Add new images - matching AddForRent format
      if (mediaFiles.image1) {
        formDataForApi.append('images', mediaFiles.image1);
      }
      if (mediaFiles.image2) {
        formDataForApi.append('images', mediaFiles.image2);
      }

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-xl">Loading property data...</div>
    </div>;
  }

  return (
    <div className="rounded-lg py-6 md:px-3">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Type - Auto-detected based on authenticated user */}
        <div>
          <label className="block text-gray-700">What best describes you?</label>
          <input
            type="text"
            value={formData.user_type === 'agent' ? 'Agent' : 'Landlord'}
            disabled
            className="w-full border border-gray-200 p-2 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
            title="User type is automatically detected based on your account"
          />
          <p className="text-xs text-gray-500 mt-1">
            Automatically detected from your account type
          </p>
        </div>

        <div>
          <label className="block text-gray-700">Property Name*</label>
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

        <div>
          <label className="block text-gray-700">Listing Type</label>
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

      {/* Price and Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Conditional rendering based on property type */}
        {formData.property_type !== "LAND" && (
          <>
            <div>
              <label className="block text-gray-700">Bedrooms</label>
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
              <label className="block text-gray-700">Bathrooms</label>
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
          <label className="block text-gray-700">Square Footage</label>
          <input
            type="number"
            name="area_sqft"
            value={formData.area_sqft}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Enter square footage"
          />
        </div>
        
        {/* Price fields based on listing type */}
        {formData.listing_type === "RENT" && (
          <>
            <div>
              <label className="block text-gray-700">Base Rent Price* (recurring payment)</label>
              <input
                type="text"
                name="rent_price"
                value={displayRentPrice}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="e.g. 12,000,000"
              />
              {formData.rent_price && fees.totalPrice > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Initial payment: ₦{formatNumberWithCommas(fees.totalPrice.toString())}
                  (includes ₦{formatNumberWithCommas(fees.totalFee.toString())} one-time fees)
                </p>
              )}
            </div>
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
          </>
        )}

        {formData.listing_type === "SALE" && (
          <div>
            <label className="block text-gray-700">Sale Price*</label>
            <input
              type="text"
              name="sale_price"
              value={displaySalePrice}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="e.g. 150,000,000"
            />
            {formData.sale_price && fees.totalPrice > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                Total payment: ₦{formatNumberWithCommas(fees.totalPrice.toString())}
                (includes ₦{formatNumberWithCommas(fees.totalFee.toString())} one-time fees)
              </p>
            )}
          </div>
        )}
      </div>

      {/* Description and Location */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Address and Description</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-gray-700">Property Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md h-32"
              placeholder="Describe your property's best features"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Property Address*</label>
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

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-normal text-[#014d98]">Existing Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative border rounded-md overflow-hidden h-48">
                <Image 
                  src={imageUrl} 
                  alt={`Property image ${index+1}`}
                  fill
                  style={{objectFit: "cover"}}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(imageUrl)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Media - Matching AddForRent */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Upload New Media</h3>
        <p className="text-sm text-gray-600 mt-2">
          Add new images or video to your property listing. You can upload up to 2 images and 1 video.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Image 1 */}
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
                <p>Drag and drop Image 1 or click to upload</p>
              )}
            </div>
          </div>

          {/* Image 2 */}
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
                <p>Drag and drop Image 2 or click to upload</p>
              )}
            </div>
          </div>

          {/* Video */}
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
                <p>Drag and drop Video or click to upload</p>
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