"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessModal from "./SuccessModal"; 
import ConfirmationModal from "./ConfirmationModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Constants moved to top for reusability
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

const FEE_RATES = {
  AGENT_FEE_RATE: 0.10,
  QARBA_FEE_RATE: 0.00,
  LANDLORD_FEE_RATE: 0.00
};

// Utility functions consolidated
const formatUtils = {
  formatNumberWithCommas: (value) => {
    const plainNumber = value.replace(/[^\d]/g, '');
    return plainNumber ? plainNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  },
  convertToPlainNumber: (formattedValue) => formattedValue.replace(/[^\d]/g, ''),
  calculateFees: (userType, rentPrice) => {
    const parsedPrice = parseInt(rentPrice, 10) || 0;
    
    if (userType === 'agent') {
      const agentFee = Math.round(parsedPrice * FEE_RATES.AGENT_FEE_RATE);
      const qarbaFee = Math.round(parsedPrice * FEE_RATES.QARBA_FEE_RATE);
      return {
        basePrice: parsedPrice,
        agentFee,
        qarbaFee,
        totalFee: agentFee + qarbaFee,
        totalPrice: parsedPrice + agentFee + qarbaFee
      };
    } else {
      const qarbaFee = Math.round(parsedPrice * FEE_RATES.LANDLORD_FEE_RATE);
      return {
        basePrice: parsedPrice,
        agentFee: 0,
        qarbaFee,
        totalFee: qarbaFee,
        totalPrice: parsedPrice + qarbaFee
      };
    }
  }
};

// API service simplified
const propertyService = {
  createProperty: async (data, mediaFiles) => {
    try {
      const formData = new FormData();
      
      // Add property details
      Object.keys(data).forEach(key => {
        if (key === 'amenities_ids' && Array.isArray(data[key])) {
          data[key].forEach(id => formData.append('amenities_ids', id));
        } else if (Array.isArray(data[key])) {
          data[key].forEach(value => formData.append(`${key}`, value));
        } else {
          formData.append(key, data[key]);
        }
      });
      
      // Add media files
      mediaFiles.images.forEach(image => {
        formData.append('images', image);
      });
      if (mediaFiles.video) formData.append('video', mediaFiles.video);
      
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('No access token found. Please log in.');

      const response = await axios.post(`${API_BASE_URL}/api/v1/properties/`, formData, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create property',
        errors: error.response?.data?.errors || {}
      };
    }
  },
  
  fetchAmenities: async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('No access token found');

      const response = await axios.get(`${API_BASE_URL}/api/v1/amenities`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching amenities:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        console.error("API endpoint not found. Please check if the API URL and endpoint path are correct.");
      }
      return [];
    }
  }
};

// Reusable components
const FileUploadBox = ({ label, onChange, file, onRemove }) => (
  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative hover:border-gray-400 transition-colors duration-200">
    <input
      type="file"
      accept={label.toLowerCase().includes("video") ? "video/*" : "image/*"}
      onChange={onChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    {file && onRemove && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 z-10 shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    )}
    <div className="text-gray-500 text-center pointer-events-none text-sm">
      {file ? (
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-xs">{label} selected</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <p className="text-xs">Upload {label.toLowerCase()}</p>
        </div>
      )}
    </div>
  </div>
);

const ImageUploadBox = ({ images, onAddImage, onRemoveImage, maxImages = 5 }) => {
  const handleFileSelect = (e) => {
    onAddImage(e);
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Display uploaded images */}
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden group hover:border-red-400 transition-colors duration-200"
          >
            <img
              src={URL.createObjectURL(image)}
              alt={`Property ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Remove button - always visible */}
            <button
              type="button"
              onClick={() => onRemoveImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-md"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add image boxes */}
        {Array.from({ length: maxImages - images.length }, (_, index) => (
          <div
            key={`add-${index}`}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#014d98] hover:bg-blue-50 transition-all duration-200 group"
            onClick={() => document.getElementById('image-upload-input-rent').click()}
          >
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mx-auto mb-2 text-gray-400 group-hover:text-[#014d98] transition-colors duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="text-xs text-gray-500 group-hover:text-[#014d98] transition-colors duration-200">
                Add Image
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        id="image-upload-input-rent"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />

      {/* Upload instructions */}
      <p className="text-sm text-gray-500 text-center">
        Upload up to {maxImages} images. Click on the boxes above to add images.
        {images.length > 0 && ` (${images.length}/${maxImages} uploaded)`}
      </p>
    </div>
  );
};

const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-11/12 max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#014d98] mb-2">Error</h3>
          <p className="text-gray-600 text-center mb-6">{message}</p>
          <button onClick={onClose} className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated Fee breakdown component with clearer recurring vs one-time fee explanation
const FeeBreakdown = ({ fees, frequency }) => {
  if (!fees.basePrice) return null;
  
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h4 className="text-lg font-medium text-[#014d98] mb-2">Fee Breakdown</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between font-medium">
          <span>Base Price (recurring {frequency.toLowerCase()}):</span>
          <span>₦{formatUtils.formatNumberWithCommas(fees.basePrice.toString())}</span>
        </div>
        {fees.agentFee > 0 && (
          <div className="flex justify-between">
            <span>Agent Fee (10%, one-time):</span>
            <span>₦{formatUtils.formatNumberWithCommas(fees.agentFee.toString())}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Qarba Fee ({fees.agentFee > 0 ? '0%' : '0%'}, one-time):</span>
          <span>₦{formatUtils.formatNumberWithCommas(fees.qarbaFee.toString())}</span>
        </div>
        <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
          <span>Initial Payment (first {frequency.toLowerCase()}):</span>
          <span className="text-[#014d98]">₦{formatUtils.formatNumberWithCommas(fees.totalPrice.toString())}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 italic">
          After initial payment, tenant will pay ₦{formatUtils.formatNumberWithCommas(fees.basePrice.toString())} {frequency.toLowerCase()}.
        </p>
      </div>
    </div>
  );
};

const AddForRent = () => {
  // Get authenticated user type from localStorage
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

  // Helper function to determine if property type should show bedroom/bathroom fields
  const shouldShowBedroomBathroom = (propertyType) => {
    const typesWithoutBedrooms = ['WAREHOUSE', 'EMPTY_LAND'];
    return !typesWithoutBedrooms.includes(propertyType);
  };

  // Form state with default values
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
    total_price: "",
    amenities_ids: [], 
    user_type: getAuthenticatedUserType(), // Set based on authenticated user
    state: "",
    city: ""
  });

  const [displayPrice, setDisplayPrice] = useState('');
  const [fees, setFees] = useState({ basePrice: 0, agentFee: 0, qarbaFee: 0, totalFee: 0, totalPrice: 0 });
  const [amenities, setAmenities] = useState([]);
  const [mediaFiles, setMediaFiles] = useState({ images: [], video: null });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState(null);

  // Ensure user type stays in sync with authenticated user
  useEffect(() => {
    const currentAuthUserType = getAuthenticatedUserType();
    if (formData.user_type !== currentAuthUserType) {
      setFormData(prev => ({ ...prev, user_type: currentAuthUserType }));
    }
  }, [formData.user_type]);

  // Reset bedroom/bathroom values when property type changes to one that doesn't need them
  useEffect(() => {
    if (!shouldShowBedroomBathroom(formData.property_type)) {
      setFormData(prev => ({ 
        ...prev, 
        bedrooms: 0, 
        bathrooms: 0 
      }));
    } else if (formData.bedrooms === 0) {
      // Reset to default values if switching back to a property type that needs them
      setFormData(prev => ({ 
        ...prev, 
        bedrooms: 1, 
        bathrooms: 1 
      }));
    }
  }, [formData.property_type]);

  // Calculate fees when price or user type changes
  useEffect(() => {
    if (formData.rent_price) {
      const calculatedFees = formatUtils.calculateFees(formData.user_type, formData.rent_price);
      setFees(calculatedFees);
      setFormData(prev => ({ ...prev, total_price: calculatedFees.totalPrice.toString() }));
    }
  }, [formData.user_type, formData.rent_price]);

  // Fetch amenities on component mount
  useEffect(() => {
    const getAmenities = async () => {
      setIsLoadingAmenities(true);
      const amenitiesData = await propertyService.fetchAmenities();
      setAmenities(amenitiesData);
      setIsLoadingAmenities(false);
    };
    getAmenities();
  }, []);

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'rent_price') {
      const formattedValue = formatUtils.formatNumberWithCommas(value);
      setDisplayPrice(formattedValue);
      setFormData({ ...formData, [name]: formatUtils.convertToPlainNumber(formattedValue) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => {
      const current = [...prev.amenities_ids];
      return {
        ...prev,
        amenities_ids: current.includes(amenityId) 
          ? current.filter(id => id !== amenityId) 
          : [...current, amenityId]
      };
    });
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (fileType === 'video') {
        setMediaFiles({ ...mediaFiles, video: file });
      } else if (fileType === 'image1' || fileType === 'image2') {
        // For backward compatibility, add to images array
        setMediaFiles({
          ...mediaFiles,
          images: [...mediaFiles.images, file]
        });
      }
    }
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFiles({
        ...mediaFiles,
        images: [...mediaFiles.images, file]
      });
    }
  };

  const removeImage = (index) => {
    setMediaFiles({
      ...mediaFiles,
      images: mediaFiles.images.filter((_, i) => i !== index)
    });
  };

  const removeVideo = () => {
    setMediaFiles({
      ...mediaFiles,
      video: null
    });
  };

  // Modal handlers
  const handleCloseModal = () => {
    setModalOpen(false);
    if (!isDraft) {
      // Reset form if it was a final submission
      setFormData({
        property_name: "", description: "", property_type: "HOUSE", listing_type: "RENT",
        submit_for_review: false, location: "", bedrooms: 1, bathrooms: 1, area_sqft: 0,
        rent_frequency: "MONTHLY", rent_price: "", total_price: "", amenities_ids: [], user_type: "landlord",
        state: "",
        city: ""
      });
      setMediaFiles({ images: [], video: null });
      setDisplayPrice('');
      setFees({ basePrice: 0, agentFee: 0, qarbaFee: 0, totalFee: 0, totalPrice: 0 });
    }
  };

  // Submission handlers
  const initiateSubmit = (isDraftSubmission) => {
    setSubmissionType(isDraftSubmission ? 'draft' : 'review');
    
    const requiredFields = ['property_name', 'description', 'location', 'rent_price'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');

    if (missingFields.length > 0) {
      setErrorMessage(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      setErrorModalOpen(true);
      return;
    }
    
    setConfirmModalOpen(true);
  };
  
  const confirmSubmit = () => {
    setConfirmModalOpen(false);
    handleSubmit(submissionType === 'draft');
  };

  const handleSubmit = async (isDraftSubmission = false) => {
    try {
      setIsLoading(true);
      
      const payload = {
        ...formData,
        submit_for_review: !isDraftSubmission,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : 0,
        total_price: fees.totalPrice.toString()
      };
      
      const response = await propertyService.createProperty(payload, mediaFiles);
        
      if (!response.success) {
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
      
      setIsDraft(isDraftSubmission);
      setModalMessage(isDraftSubmission
        ? 'Your property has been saved as a draft. You can continue editing or view your listings.'
        : 'Your property has been submitted for review. You will be notified when it is approved.');
      setModalOpen(true);
        
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong');
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg py-6 md:px-3">
      <h2 className="text-2xl font-normal text-[#014d98] mb-6">Property Details</h2>

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
        {/* Property Type */}
        <div>
          <label className="block text-gray-700">Property Type</label>
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
        {/* Basic Property Details - Conditional based on property type */}
        {shouldShowBedroomBathroom(formData.property_type) && (
          <>
            <div>
              <label className="block text-gray-700">Bedrooms</label>
              <select name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}{n === 5 ? '+' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Bathrooms</label>
              <select name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}{n === 5 ? '+' : ''}</option>)}
              </select>
            </div>
          </>
        )}
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
        {/* Rent Details */}
        <div>
          <label className="block text-gray-700">Rent Frequency</label>
          <select name="rent_frequency" value={formData.rent_frequency} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md">
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="e.g. Lagos"
          />
        </div>
        <div>
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="e.g. Ikeja"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700">Base Rent Price (recurring payment)</label>
          <input
            type="text"
            name="rent_price"
            value={displayPrice}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="12,000,000"
          />
          <p className="text-xs text-gray-500 mt-1">
            This is the base price that will be paid {formData.rent_frequency.toLowerCase()}. 
            {formData.user_type === 'agent' 
              ? ' Agent fee and Qarba fee are one-time payments added to the first payment only.' 
              : ' Qarba fee is a one-time payment added to the first payment only.'}
          </p>
        </div>
      </div>

      {/* Fee Breakdown */}
      {formData.rent_price && (
        <div className="mt-2 md:w-2/3">
          <FeeBreakdown fees={fees} frequency={formData.rent_frequency} />
        </div>
      )}

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
              placeholder="Tell potential renters about your property's best features"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Property Address</label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md h-32"
              placeholder="Explain the address for easy navigation"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Upload Media */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Upload Media</h3>
        <p className="text-sm text-gray-600 mt-2">
          Showcase your property with high-quality images and a video.
        </p>

        {/* Images Upload */}
        <div className="mt-4">
          <h4 className="text-lg font-medium text-[#014d98] mb-2">Property Images</h4>
          <ImageUploadBox
            images={mediaFiles.images}
            onAddImage={handleAddImage}
            onRemoveImage={removeImage}
            maxImages={5}
          />
        </div>

        {/* Video Upload */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-[#014d98] mb-2">Property Video</h4>
          <FileUploadBox
            label="Video"
            onChange={(e) => handleFileChange(e, 'video')}
            file={mediaFiles.video}
            onRemove={removeVideo}
          />
        </div>
      </div>

      {/* Features and Amenities */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Features and Amenities</h3>
        {isLoadingAmenities ? (
          <div className="text-center py-4">
            <p>Loading amenities...</p>
          </div>
        ) : amenities.length === 0 ? (
          <div className="text-center py-4">
            <p>No amenities available. Please try refreshing the page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {amenities.map((amenity) => (
              <label key={amenity.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={formData.amenities_ids.includes(amenity.id)}
                  onChange={() => handleAmenityToggle(amenity.id)}
                />
                <span>{amenity.icon} {amenity.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => initiateSubmit(true)}
          disabled={isLoading}
          className="border-2 border-blue-500 text-blue-500 py-2 px-6 rounded-md hover:bg-blue-100 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save as draft'}
        </button>
        <button
          type="button"
          onClick={() => initiateSubmit(false)}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-6 rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit for review'}
        </button>
      </div>

      {/* Modals */}
      <ConfirmationModal 
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmSubmit}
        title={submissionType === 'draft' ? "Save as Draft?" : "Submit Property?"}
        message={
          submissionType === 'draft' 
            ? "Are you sure you want to save this property as a draft? You can edit it later."
            : "Are you sure you want to submit this property for review? Please verify that all information is correct."
        }
      />

      <SuccessModal 
        isOpen={modalOpen}
        onClose={handleCloseModal}
        message={modalMessage}
        isDraft={isDraft}
      />
      
      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage}
      />
    </div>
  );
};

export default AddForRent;