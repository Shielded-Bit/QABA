"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import DocumentUploadModal from "../../components/DocumentUploadModal"; // Import the new modal component

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Fee rates constants
const FEE_RATES = {
  AGENT_FEE_RATE: 0.10,
  QARBA_FEE_RATE: 0.00,
  LANDLORD_FEE_RATE: 0.00
};

// Helper functions
const formatNumberWithCommas = (value) => {
  const plainNumber = value.replace(/[^\d]/g, '');
  return plainNumber ? plainNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
};

const convertToPlainNumber = (formattedValue) => {
  return formattedValue.replace(/[^\d]/g, '');
};

// Fee calculation function
const calculateFees = (userType, salePrice) => {
  const parsedPrice = parseInt(salePrice, 10) || 0;

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
};

// Constants
const PROPERTY_TYPES = [
  { value: "HOUSE", label: "House" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "FULL_DETACHED", label: "Full Detached" },
  { value: "SEMI_DETACHED", label: "Semi Detached" },
  { value: "EMPTY_LAND", label: "Empty Land" },
  { value: "LAND_WITH_BUILDING", label: "Land with Building" }
];

const DOCUMENT_TYPES = [
  { value: "DEED", label: "Deed" },
  { value: "TITLE", label: "Title Certificate" },
  { value: "PERMIT", label: "Building Permit" },
  { value: "SURVEY", label: "Survey Plan" },
  { value: "LAND_USE", label: "Land Use Approval" },
  { value: "TAX", label: "Tax Receipt" },
  { value: "FLOOR_PLAN", label: "Floor Plan" },
  { value: "UTILITY", label: "Utility Bills" },
  { value: "OTHER", label: "Other Document" }
];

// Reusable components
const FormField = ({ label, children, className = "" }) => (
  <div className={className}>
    <label className="block text-gray-700">{label}</label>
    {children}
  </div>
);

const Select = ({ name, value, onChange, options, placeholder }) => (
  <select 
    name={name}
    value={value}
    onChange={onChange}
    className="w-full border border-gray-300 p-2 rounded-md"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

const FormInput = ({ type = "text", name, value, onChange, placeholder, className = "" }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    className={`w-full border border-gray-300 p-2 rounded-md ${className}`}
    placeholder={placeholder}
  />
);

const FileUpload = ({ onChange, fileType, selectedFile, onRemove }) => (
  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative hover:border-gray-400 transition-colors duration-200">
    <input
      type="file"
      accept={fileType === 'video' ? "video/*" : fileType === 'document' ? ".pdf,.doc,.docx,.xls,.xlsx" : "image/*"}
      onChange={(e) => onChange(e, fileType)}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    {selectedFile && onRemove && (
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
      {selectedFile ? (
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-xs">{fileType === 'video' ? 'Video' : fileType === 'document' ? 'Document' : 'Image'} selected</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <p className="text-xs">Upload {fileType === 'video' ? 'video' : fileType === 'document' ? 'document' : 'image'}</p>
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
            onClick={() => document.getElementById('image-upload-input').click()}
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
        id="image-upload-input"
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

// Fee breakdown component
const FeeBreakdown = ({ fees, userType }) => {
  if (!fees.basePrice) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h4 className="text-lg font-medium text-[#014d98] mb-2">Fee Breakdown</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between font-medium">
          <span>Sale Price:</span>
          <span>₦{formatNumberWithCommas(fees.basePrice.toString())}</span>
        </div>
        {fees.agentFee > 0 && (
          <div className="flex justify-between">
            <span>Agent Commission (10%):</span>
            <span>₦{formatNumberWithCommas(fees.agentFee.toString())}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Qarba Fee (0%):</span>
          <span>₦{formatNumberWithCommas(fees.qarbaFee.toString())}</span>
        </div>
        <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
          <span>Total Price:</span>
          <span className="text-[#014d98]">₦{formatNumberWithCommas(fees.totalPrice.toString())}</span>
        </div>
        {userType === 'agent' && (
          <p className="text-xs text-gray-500 mt-1 italic">
            Agent commission and Qarba fee are added to the sale price.
          </p>
        )}
      </div>
    </div>
  );
};

// API functions
const createProperty = async (data, mediaFiles, documents) => {
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

    // Add documents
    documents.forEach(doc => {
      formData.append('documents', doc.file);
      formData.append('document_types', doc.type);
    });

    // DEBUG: Log all FormData entries
    console.log('=== FORMDATA BEING SENT ===');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File: ${value.name}]`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    console.log('=== END FORMDATA ===');

    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('No access token found. Please log in.');
    }

   const response = await axios.post(`${API_BASE_URL}/api/v1/properties/`, formData, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create property',
      errors: error.response?.data?.errors || {}
    };
  }
};

const fetchAmenities = async () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found. Please log in.');
    }

   const response = await axios.get(`${API_BASE_URL}/api/v1/amenities`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return [];
  }
};

const AddForSell = () => {
  // Get authenticated user type from localStorage
  const getAuthenticatedUserType = () => {
    if (typeof window !== 'undefined') {
      const userType = localStorage.getItem('user_type');
      // Convert LANDLORD to landlord and AGENT to agent for fee calculation
      if (userType === 'LANDLORD') return 'landlord';
      if (userType === 'AGENT') return 'agent';
      return 'landlord'; // Default fallback
    }
    return 'landlord';
  };

  // Helper function to determine if property type should show bedroom/bathroom fields
  const shouldShowBedroomBathroom = (propertyType) => {
    const typesWithoutBedrooms = ['EMPTY_LAND'];
    return !typesWithoutBedrooms.includes(propertyType);
  };

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
    sale_price: "",
    total_price: "",
    property_status: "New",
    amenities_ids: [],
    user_type: getAuthenticatedUserType(), // Set based on authenticated user
    state: "",
    city: ""
  });

  // Documents state
  const [documents, setDocuments] = useState([]);

  // Document modal state
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  // Other states
  const [displayPrice, setDisplayPrice] = useState('');
  const [fees, setFees] = useState({ basePrice: 0, agentFee: 0, qarbaFee: 0, totalFee: 0, totalPrice: 0 });
  const [amenities, setAmenities] = useState([]);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(false);
  const [mediaFiles, setMediaFiles] = useState({
    images: [],
    video: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState(null);

  // Effects
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

  useEffect(() => {
    if (formData.sale_price) {
      setDisplayPrice(formatNumberWithCommas(formData.sale_price));
    }
  }, [formData.sale_price]);

  // Calculate fees when price or user type changes
  useEffect(() => {
    if (formData.sale_price) {
      console.log('Calculating fees for sale_price:', formData.sale_price, 'type:', typeof formData.sale_price);
      const calculatedFees = calculateFees(formData.user_type, formData.sale_price);
      console.log('Calculated fees:', calculatedFees);
      setFees(calculatedFees);
      setFormData(prev => ({ ...prev, total_price: calculatedFees.totalPrice.toString() }));
    }
  }, [formData.user_type, formData.sale_price]);

  useEffect(() => {
    const getAmenities = async () => {
      setIsLoadingAmenities(true);
      try {
        const amenitiesData = await fetchAmenities();
        setAmenities(amenitiesData);
      } finally {
        setIsLoadingAmenities(false);
      }
    };

    getAmenities();
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'sale_price') {
      const formattedValue = formatNumberWithCommas(value);
      const plainValue = convertToPlainNumber(formattedValue);
      console.log('Sale price input change:', { input: value, formatted: formattedValue, plain: plainValue });
      setDisplayPrice(formattedValue);
      setFormData({
        ...formData,
        [name]: plainValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prevState => {
      const currentAmenities = [...prevState.amenities_ids];
      return {
        ...prevState,
        amenities_ids: currentAmenities.includes(amenityId)
          ? currentAmenities.filter(id => id !== amenityId)
          : [...currentAmenities, amenityId]
      };
    });
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (fileType === 'video') {
        setMediaFiles({
          ...mediaFiles,
          video: file
        });
      } else if (fileType === 'image') {
        // For images, add to the images array
        setMediaFiles({
          ...mediaFiles,
          images: [...mediaFiles.images, file]
        });
      }
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

  // New document upload handler using the modal
  const handleDocumentUpload = ({ file, type }) => {
    setDocuments([...documents, { file, type }]);
    setIsDocumentModalOpen(false);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleCloseModal = () => {
    setModalOpen(false);

    if (!isDraft) {
      setFormData({
        property_name: "",
        description: "",
        property_type: "HOUSE",
        listing_type: "SALE",
        submit_for_review: false,
        location: "",
        bedrooms: 1,
        bathrooms: 1,
        area_sqft: 0,
        sale_price: "",
        total_price: "",
        property_status: "New",
        amenities_ids: [],
        user_type: getAuthenticatedUserType(),
        state: "",
        city: ""
      });

      setMediaFiles({
        images: [],
        video: null
      });

      setDocuments([]);
      setDisplayPrice('');
      setFees({ basePrice: 0, agentFee: 0, qarbaFee: 0, totalFee: 0, totalPrice: 0 });
    }
  };

  const initiateSubmit = (isDraftSubmission) => {
    setSubmissionType(isDraftSubmission ? 'draft' : 'review');
    
    const requiredFields = [
      'property_name', 
      'description', 
      'location', 
      'sale_price'
    ];

    const missingFields = requiredFields.filter(field => 
      !formData[field] || formData[field].trim() === ''
    );

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
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

      // Add agent_commission only if user is an agent
      if (formData.user_type === 'agent' && fees.agentFee > 0) {
        payload.agent_commission = fees.agentFee.toFixed(2);
      }

      console.log('Submitting property with payload:', {
        formData_user_type: formData.user_type,
        listing_type: formData.listing_type,
        sale_price: formData.sale_price,
        sale_price_type: typeof formData.sale_price,
        total_price: payload.total_price,
        total_price_type: typeof payload.total_price,
        agent_commission: payload.agent_commission,
        agentFee: fees.agentFee,
        fees_object: fees,
        calculated_total: parseFloat(formData.sale_price) + fees.agentFee + fees.qarbaFee
      });

      const response = await createProperty(payload, mediaFiles, documents);
        
      if (!response.success) {
        if (response.errors?.admin_user) {
          if (isDraftSubmission) {
            setIsDraft(true);
            setModalMessage('Your property has been saved as a draft locally.');
            setModalOpen(true);
            return;
          }
          
          alert('Property submission requires admin review. Please contact support.');
          return;
        }
        
        throw new Error(response.message || "Failed to submit property data");
      }
      
      setIsDraft(isDraftSubmission);
      setModalMessage(isDraftSubmission
        ? 'Your property has been saved as a draft. You can continue editing or view your listings.'
        : 'Your property has been submitted for review. You will be notified when it is approved.'
      );
      setModalOpen(true);
        
    } catch (error) {
      console.error("Error submitting property:", error);
      alert(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Options for dropdowns
  const countOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5+" }
  ];

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Under Construction", label: "Under Construction" },
    { value: "Ready to Move In", label: "Ready to Move In" }
  ];

  const listingTypeOptions = [
    { value: "SALE", label: "For Sale" }
  ];

  return (
    <div className="rounded-lg py-6 md:px-3">
      <h2 className="text-2xl font-normal text-[#014d98] mb-6">Property Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="What best describes you?">
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
        </FormField>
        <FormField label="Property Type">
          <Select 
            name="property_type"
            value={formData.property_type}
            onChange={handleInputChange}
            options={PROPERTY_TYPES}
          />
        </FormField>
        <FormField label="Property Name">
          <FormInput
            name="property_name"
            value={formData.property_name}
            onChange={handleInputChange}
            placeholder="Greenhood House"
          />
        </FormField>
        {/* Conditional Bedroom and Bathroom fields based on property type */}
        {shouldShowBedroomBathroom(formData.property_type) && (
          <>
            <FormField label="Number of Bedrooms">
              <Select 
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                options={countOptions}
              />
            </FormField>
            <FormField label="Number of Bathrooms">
              <Select 
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                options={countOptions}
              />
            </FormField>
          </>
        )}
        <FormField label="Listing Type">
          <Select 
            name="listing_type"
            value={formData.listing_type}
            onChange={handleInputChange}
            options={listingTypeOptions}
          />
        </FormField>
        <FormField label="Square Footage (Optional)">
          <FormInput
            type="number"
            name="area_sqft"
            value={formData.area_sqft}
            onChange={handleInputChange}
            placeholder="Enter square footage"
          />
        </FormField>
        <FormField label="Sale Price" className="md:col-span-2">
          <FormInput
            name="sale_price"
            value={displayPrice}
            onChange={handleInputChange}
            placeholder="12,000,000"
          />
          <p className="text-xs text-gray-500 mt-1">
            This is the base sale price.
            {formData.user_type === 'agent'
              ? ' Agent commission (10%) will be added to this price.'
              : ' No additional fees will be added to this price.'}
          </p>
        </FormField>
        <FormField label="Property Status">
          <Select
            name="property_status"
            value={formData.property_status}
            onChange={handleInputChange}
            options={statusOptions}
          />
        </FormField>
        <FormField label="State">
          <FormInput
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="e.g. Lagos"
          />
        </FormField>
        <FormField label="City">
          <FormInput
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="e.g. Ikeja"
          />
        </FormField>
      </div>

      {/* Fee Breakdown */}
      {formData.sale_price && (
        <div className="mt-2 md:w-2/3">
          <FeeBreakdown fees={fees} userType={formData.user_type} />
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Address and Description</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormField label="Property Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md h-32"
              placeholder="In a couple of sentences, tell potential buyers about your property's best features"
            ></textarea>
          </FormField>
          <FormField label="Property Address">
            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md h-32"
              placeholder="In detail, explain the address of the environment for easy navigation"
            ></textarea>
          </FormField>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Upload Media</h3>
        <p className="text-sm text-gray-600 mt-2">
          Showcase your property with high-quality images and a video. Clear visuals attract more buyers
          and increase engagement.
        </p>

        {/* Images Upload */}
        <div className="mt-4">
          <h4 className="text-lg font-medium text-[#014d98] mb-2">Property Images</h4>
          <ImageUploadBox
            images={mediaFiles.images}
            onAddImage={(e) => handleFileChange(e, 'image')}
            onRemoveImage={removeImage}
            maxImages={5}
          />
        </div>

        {/* Video Upload */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-[#014d98] mb-2">Property Video</h4>
          <FileUpload
            onChange={handleFileChange}
            fileType="video"
            selectedFile={mediaFiles.video}
            onRemove={removeVideo}
          />
        </div>
      </div>

      {/* Updated Document Upload Section */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Property Documents</h3>
        <p className="text-sm text-gray-600 mt-2">
          Upload important property documents such as deeds, title certificates, permits, etc.
        </p>
        
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => setIsDocumentModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Upload Document
            </span>
          </button>
        </div>
        
        {/* Display uploaded documents */}
        {documents.length > 0 && (
          <div className="mt-4">
            <h4 className="text-2xl font-bold text-gradient mb-3">Uploaded Documents</h4>
            <div className="mt-2 border rounded-md divide-y">
              {documents.map((doc, index) => {
                const docType = DOCUMENT_TYPES.find(type => type.value === doc.type);
                return (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium">{docType ? docType.label : doc.type}</p>
                        <p className="text-sm text-gray-500">{doc.file.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
      <DocumentUploadModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onUpload={handleDocumentUpload}
        documentTypes={DOCUMENT_TYPES}
      />

      <ConfirmationModal 
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmSubmit}
        title={submissionType === 'draft' ? "Save as Draft?" : "Submit Property?"}
        message={
          submissionType === 'draft' 
            ? "Are you sure you want to save this property as a draft? You can edit it later."
            : "Are you sure you want to submit this property for review? Please verify that all information is correct and complete."
        }
      />

      <SuccessModal 
        isOpen={modalOpen}
        onClose={handleCloseModal}
        message={modalMessage}
        isDraft={isDraft}
      />
    </div>
  );
};

export default AddForSell;