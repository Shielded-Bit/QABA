"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import DocumentUploadModal from "../../components/DocumentUploadModal"; // Import the new modal component

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://qaba.onrender.com/api/v1";

// Helper functions
const formatNumberWithCommas = (value) => {
  const plainNumber = value.replace(/[^\d]/g, '');
  return plainNumber ? plainNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
};

const convertToPlainNumber = (formattedValue) => {
  return formattedValue.replace(/[^\d]/g, '');
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

const FileUpload = ({ onChange, fileType, selectedFile }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex items-center justify-center relative">
    <input
      type="file"
      accept={fileType === 'video' ? "video/*" : fileType === 'document' ? ".pdf,.doc,.docx,.xls,.xlsx" : "image/*"}
      onChange={(e) => onChange(e, fileType)}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    <div className="text-gray-500 text-center pointer-events-none">
      {selectedFile ? (
        <p>Selected: {selectedFile.name}</p>
      ) : (
        <p>Drag and drop {fileType === 'video' ? 'a video' : fileType === 'document' ? 'a document' : 'an image'} or click to upload</p>
      )}
    </div>
  </div>
);

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
    if (mediaFiles.image1) formData.append('images', mediaFiles.image1);
    if (mediaFiles.image2) formData.append('images', mediaFiles.image2);
    if (mediaFiles.video) formData.append('video', mediaFiles.video);
    
    // Add documents
    documents.forEach(doc => {
      formData.append('documents', doc.file);
      formData.append('document_types', doc.type);
    });
    
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found. Please log in.');
    }

    const response = await axios.post(`${API_BASE_URL}/properties/`, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
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

    const response = await axios.get(`${API_BASE_URL}/amenities/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return [];
  }
};

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
    sale_price: "",
    property_status: "New",
    amenities_ids: [],
    user_type: "LandLord"
  });

  // Documents state
  const [documents, setDocuments] = useState([]);
  
  // Document modal state
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  // Other states
  const [displayPrice, setDisplayPrice] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(false);
  const [mediaFiles, setMediaFiles] = useState({
    image1: null,
    image2: null,
    video: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState(null);

  // Effects
  useEffect(() => {
    if (formData.sale_price) {
      setDisplayPrice(formatNumberWithCommas(formData.sale_price));
    }
    
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
      setDisplayPrice(formattedValue);
      setFormData({
        ...formData,
        [name]: convertToPlainNumber(formattedValue)
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
      setMediaFiles({
        ...mediaFiles,
        [fileType]: file
      });
    }
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
        property_status: "New",
        amenities_ids: [],
        user_type: "LandLord"
      });
      
      setMediaFiles({
        image1: null,
        image2: null,
        video: null
      });
      
      setDocuments([]);
      setDisplayPrice('');
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
        area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : 0
      };
      
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

  const userTypeOptions = [
    { value: "LandLord", label: "Landlord" },
    { value: "agent", label: "Agent" }
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
          <Select 
            name="user_type"
            value={formData.user_type}
            onChange={handleInputChange}
            options={userTypeOptions}
          />
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
        <FormField label="Sale Price">
          <FormInput
            name="sale_price"
            value={displayPrice}
            onChange={handleInputChange}
            placeholder="12,000,000"
          />
        </FormField>
        <FormField label="Property Status">
          <Select 
            name="property_status"
            value={formData.property_status}
            onChange={handleInputChange}
            options={statusOptions}
          />
        </FormField>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <FileUpload 
            onChange={handleFileChange} 
            fileType="image1"
            selectedFile={mediaFiles.image1} 
          />
          <FileUpload 
            onChange={handleFileChange} 
            fileType="image2"
            selectedFile={mediaFiles.image2} 
          />
          <FileUpload 
            onChange={handleFileChange} 
            fileType="video"
            selectedFile={mediaFiles.video} 
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
            <h4 className="text-lg font-medium">Uploaded Documents</h4>
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