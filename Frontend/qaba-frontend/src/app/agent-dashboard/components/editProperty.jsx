"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import DocumentUploadModal from "../../components/DocumentUploadModal";
import ConfirmationModal from "./ConfirmationModal";

// Constants and helper functions
const PROPERTY_TYPES = [
  { value: "HOUSE", label: "House" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "SELF_CONTAIN", label: "Self Contain" },
  { value: "ONE_BEDROOM_FLAT", label: "One Bedroom Flat" },
  { value: "TWO_BEDROOM_FLAT", label: "Two Bedroom Flat" },
  { value: "THREE_BEDROOM_FLAT", label: "Three Bedroom Flat" },
  { value: "FOUR_BEDROOM_FLAT", label: "Four Bedroom Flat" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "FULL_DETACHED", label: "Full Detached" },
  { value: "SEMI_DETACHED", label: "Semi Detached" },
  { value: "WAREHOUSE", label: "Warehouse" },
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

const RENT_FREQUENCIES = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "WEEKLY", label: "Weekly" }
];

const PROPERTY_STATUSES = [
  { value: "AVAILABLE", label: "Available" },
  { value: "UNAVAILABLE", label: "Unavailable" },
  { value: "PENDING", label: "Pending" }
];

const LISTING_TYPES = [
  { value: "RENT", label: "Rent" },
  { value: "SALE", label: "Sale" }
];

// Helper functions
const formatNumberWithCommas = (value) => {
  const plainNumber = value.replace(/[^\d]/g, '');
  return plainNumber ? plainNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
};

const convertToPlainNumber = (formattedValue) => {
  return formattedValue.replace(/[^\d]/g, '');
};

// FormField component
const FormField = ({ label, children, required = false, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

// Select component
const Select = ({ name, value, onChange, children, className = "", ...props }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  >
    {children}
  </select>
);

// Fee breakdown component
const FeeBreakdown = ({ fees, userType, listingType, rentFrequency, serviceCharge, cautionFee }) => {
  if (!fees.basePrice) return null;

  const parsedServiceCharge = parseFloat(serviceCharge) || 0;
  const parsedCautionFee = parseFloat(cautionFee) || 0;
  const totalPrice = fees.totalPrice + parsedServiceCharge + parsedCautionFee;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h4 className="text-lg font-medium text-[#014d98] mb-2">Fee Breakdown</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between font-medium">
          <span>{listingType === 'RENT' ? `Base Price (recurring ${rentFrequency?.toLowerCase() || 'monthly'}):` : 'Sale Price:'}</span>
          <span>₦{formatNumberWithCommas(fees.basePrice.toString())}</span>
        </div>
        {fees.agentFee > 0 && (
          <div className="flex justify-between">
            <span>Agent {listingType === 'SALE' ? 'Commission' : 'Fee'} (10%, one-time):</span>
            <span>₦{formatNumberWithCommas(fees.agentFee.toString())}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Qarba Fee ({listingType === 'SALE' ? '0%' : '0%'}, one-time):</span>
          <span>₦{formatNumberWithCommas(fees.qarbaFee.toString())}</span>
        </div>
        {parsedServiceCharge > 0 && (
          <div className="flex justify-between">
            <span>Service Charge:</span>
            <span>₦{formatNumberWithCommas(parsedServiceCharge.toString())}</span>
          </div>
        )}
        {parsedCautionFee > 0 && (
          <div className="flex justify-between">
            <span>Caution Fee:</span>
            <span>₦{formatNumberWithCommas(parsedCautionFee.toString())}</span>
          </div>
        )}
        <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
          <span>{listingType === 'RENT' ? `Initial Payment (first ${rentFrequency?.toLowerCase() || 'month'}):` : 'Total Price:'}</span>
          <span className="text-[#014d98]">₦{formatNumberWithCommas(totalPrice.toString())}</span>
        </div>
        {listingType === 'RENT' && (
          <p className="text-xs text-gray-500 mt-1 italic">
            After initial payment, tenant will pay ₦{formatNumberWithCommas(fees.basePrice.toString())} {rentFrequency?.toLowerCase() || 'monthly'}.
          </p>
        )}
      </div>
    </div>
  );
};

// ImageUploadBox component - matching AddForRent and AddForSell
const ImageUploadBox = ({ images, onAddImage, onRemoveImage, maxImages = 5, inputId = "image-upload-input" }) => {
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
            onClick={() => document.getElementById(inputId).click()}
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
        id={inputId}
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

// FileUploadBox for video
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
    service_charge: "",
    caution_fee: "",
    amenities: [],
    user_type: getAuthenticatedUserType(), // Set based on authenticated user, not property data
    // Fields from your API example
    listing_status: "DRAFT",
    property_status: "AVAILABLE",
    lister_type: "LANDLOARD",
    state: "",
    city: ""
  });

  // Formatted price display states
  const [displayRentPrice, setDisplayRentPrice] = useState('');
  const [displaySalePrice, setDisplaySalePrice] = useState('');
  const [displayServiceCharge, setDisplayServiceCharge] = useState('');
  const [displayCautionFee, setDisplayCautionFee] = useState('');

  // Fee calculation state
  const [fees, setFees] = useState({
    basePrice: 0,
    agentFee: 0,
    qarbaFee: 0,
    totalFee: 0,
    totalPrice: 0
  });

  // Media files state - matching AddForRent and AddForSell structure
  const [mediaFiles, setMediaFiles] = useState({
    images: [],
    video: null
  });

  // Existing images from the property
  const [existingImages, setExistingImages] = useState([]);

  // Track images to delete
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Documents state - matching AddForSell
  const [documents, setDocuments] = useState([]);

  // Document modal state
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  // Confirmation modal state - matching AddForRent and AddForSell
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState(null);

  // Amenities state - matching AddForRent and AddForSell
  const [amenities, setAmenities] = useState([]);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(false);

  // Format number with commas for better readability
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    const plainNumber = value.toString().replace(/[^\d]/g, '');
    return plainNumber ? plainNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  };

  // Calculate fees based on user type and price - matching AddForRent and AddForSell
  const calculateFees = (userType, price, listingType) => {
    const parsedPrice = parseInt(price, 10) || 0;

    if (userType === 'agent') {
      const agentFee = Math.round(parsedPrice * 0.10); // 10%
      const qarbaFee = Math.round(parsedPrice * 0.00); // 0% for both rent and sale
      return {
        basePrice: parsedPrice,
        agentFee,
        qarbaFee,
        totalFee: agentFee + qarbaFee,
        totalPrice: parsedPrice + agentFee + qarbaFee
      };
    } else {
      const qarbaFee = Math.round(parsedPrice * 0.00); // 0% for both rent and sale
      return {
        basePrice: parsedPrice,
        agentFee: 0,
        qarbaFee,
        totalFee: qarbaFee,
        totalPrice: parsedPrice + qarbaFee
      };
    }
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
          service_charge: data.service_charge !== undefined ? data.service_charge : "",
          caution_fee: data.caution_fee !== undefined ? data.caution_fee : "",
          amenities: Array.isArray(data.amenities)
            ? data.amenities.map(amenity => typeof amenity === 'object' && amenity.id ? amenity.id : amenity)
            : [],
          user_type: authenticatedUserType, // Always use authenticated user type
          listing_status: data.listing_status || "DRAFT",
          property_status: data.property_status || "AVAILABLE",
          lister_type: data.lister_type || "LANDLOARD",
          state: data.state || "",
          city: data.city || ""
        });
        
        // Format price displays
        if (data.rent_price) {
          setDisplayRentPrice(formatNumberWithCommas(data.rent_price));
        }

        if (data.sale_price) {
          setDisplaySalePrice(formatNumberWithCommas(data.sale_price));
        }

        if (data.service_charge) {
          setDisplayServiceCharge(formatNumberWithCommas(data.service_charge));
        }

        if (data.caution_fee) {
          setDisplayCautionFee(formatNumberWithCommas(data.caution_fee));
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
      const calculatedFees = calculateFees(formData.user_type, formData.rent_price, formData.listing_type);
      setFees(calculatedFees);
    } else if (formData.listing_type === 'SALE' && formData.sale_price) {
      const calculatedFees = calculateFees(formData.user_type, formData.sale_price, formData.listing_type);
      setFees(calculatedFees);
    }
  }, [formData.user_type, formData.rent_price, formData.sale_price, formData.listing_type]);

  // Fetch amenities on component mount - matching AddForRent and AddForSell
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setIsLoadingAmenities(true);
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await axios.get(`${API_BASE_URL}/amenities`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        setAmenities(response.data.success ? response.data.data : []);
      } catch (error) {
        console.error("Error fetching amenities:", error.response?.data || error.message);
        if (error.response?.status === 404) {
          console.error("API endpoint not found. Please check if the API URL and endpoint path are correct.");
        }
      } finally {
        setIsLoadingAmenities(false);
      }
    };

    fetchAmenities();
  }, [API_BASE_URL]);

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
    } else if (name === 'service_charge') {
      const formattedValue = formatNumberWithCommas(value);
      setDisplayServiceCharge(formattedValue);

      setFormData({
        ...formData,
        [name]: formattedValue.replace(/[^\d]/g, '')
      });
    } else if (name === 'caution_fee') {
      const formattedValue = formatNumberWithCommas(value);
      setDisplayCautionFee(formattedValue);

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

  // Handle amenities selection - matching AddForRent and AddForSell
  const handleAmenityToggle = (amenityId) => {
    setFormData(prevState => {
      const currentAmenities = [...prevState.amenities];

      if (currentAmenities.includes(amenityId)) {
        return {
          ...prevState,
          amenities: currentAmenities.filter(id => id !== amenityId)
        };
      } else {
        return {
          ...prevState,
          amenities: [...currentAmenities, amenityId]
        };
      }
    });
  };

  // Handle adding new images - matching AddForRent and AddForSell
  const handleAddImage = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).slice(0, 5 - mediaFiles.images.length);
      setMediaFiles({
        ...mediaFiles,
        images: [...mediaFiles.images, ...newImages]
      });
      toast.success(`${newImages.length} image(s) selected successfully`);
    }
  };

  // Handle removing new image
  const removeImage = (index) => {
    setMediaFiles({
      ...mediaFiles,
      images: mediaFiles.images.filter((_, i) => i !== index)
    });
    toast.success('Image removed');
  };

  // Handle video upload
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFiles({
        ...mediaFiles,
        video: file
      });
      toast.success('Video selected successfully');
    }
  };

  // Handle removing video
  const removeVideo = () => {
    setMediaFiles({
      ...mediaFiles,
      video: null
    });
    toast.success('Video removed');
  };

  // Handle removing existing image
  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
    toast.success('Image marked for deletion');
  };

  // Handle document upload - matching AddForSell
  const handleDocumentUpload = ({ file, type }) => {
    setDocuments([...documents, { file, type }]);
    setIsDocumentModalOpen(false);
    toast.success('Document added successfully');
  };

  // Handle removing document
  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
    toast.success('Document removed');
  };

  // Initiate submit - matching AddForRent and AddForSell
  const initiateSubmit = (isDraftSubmission) => {
    setSubmissionType(isDraftSubmission ? 'draft' : 'review');

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

    setConfirmModalOpen(true);
  };

  // Confirm submit - matching AddForRent and AddForSell
  const confirmSubmit = () => {
    setConfirmModalOpen(false);
    handleSubmit(submissionType === 'draft');
  };

  // Submit form - handles both draft and review
  const handleSubmit = async (isDraft = false) => {

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
        total_price: fees.totalPrice.toString(), // Add calculated total_price
        submit_for_review: !isDraft // Explicitly set submit_for_review
      };

      // Add all form data to FormData
      Object.keys(updatedFormData).forEach(key => {
        if (key === 'amenities' && Array.isArray(updatedFormData[key])) {
          // Handle amenities array - send as amenities_ids to match AddForRent and AddForSell
          updatedFormData[key].forEach(id => {
            formDataForApi.append('amenities_ids', id);
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

      // Add new images - matching AddForRent and AddForSell format
      mediaFiles.images.forEach(image => {
        formDataForApi.append('images', image);
      });

      // Add video if selected
      if (mediaFiles.video) {
        formDataForApi.append('video', mediaFiles.video);
      }

      // Add documents - matching AddForSell
      documents.forEach(doc => {
        formDataForApi.append('documents', doc.file);
        formDataForApi.append('document_types', doc.type);
      });
      
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
        <FormField label="What best describes you?">
          <input
            type="text"
            value={formData.user_type === 'agent' ? 'Agent' : 'Landlord'}
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
            title="User type is automatically detected based on your account"
          />
          <p className="text-xs text-gray-500 mt-1">
            Automatically detected from your account type
          </p>
        </FormField>

        <FormField label="Property Name" required>
          <input
            type="text"
            name="property_name"
            value={formData.property_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Greenhood House"
          />
        </FormField>

        <FormField label="Property Type">
          <Select
            name="property_type"
            value={formData.property_type}
            onChange={handleInputChange}
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Listing Type">
          <Select
            name="listing_type"
            value={formData.listing_type}
            onChange={handleInputChange}
            disabled
          >
            {LISTING_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Listing type cannot be changed after creation
          </p>
        </FormField>
      </div>

      {/* Price and Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Conditional rendering based on property type */}
        {formData.property_type !== "EMPTY_LAND" && (
          <>
            <FormField label="Bedrooms">
              <Select
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num === 5 ? "5+" : num}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Bathrooms">
              <Select
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num === 5 ? "5+" : num}</option>
                ))}
              </Select>
            </FormField>
          </>
        )}

        <FormField label="Square Footage (Optional)">
          <input
            type="number"
            name="area_sqft"
            value={formData.area_sqft}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter square footage"
          />
        </FormField>

        <FormField label="State">
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Lagos"
          />
        </FormField>

        <FormField label="City">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Ikeja"
          />
        </FormField>

        {/* Price fields based on listing type */}
        {formData.listing_type === "RENT" && (
          <>
            <FormField label="Base Rent Price (recurring payment)" required>
              <input
                type="text"
                name="rent_price"
                value={displayRentPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 12,000,000"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the base rent price.
                {formData.user_type === 'agent'
                  ? ' Agent fee and Qarba fee are one-time payments added to the first payment only.' 
                  : ' Qarba fee is a one-time payment added to the first payment only.'}
              </p>
            </FormField>
            <FormField label="Rent Frequency">
              <Select
                name="rent_frequency"
                value={formData.rent_frequency}
                onChange={handleInputChange}
              >
                {RENT_FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Service Charge (Optional)">
              <input
                type="text"
                name="service_charge"
                value={displayServiceCharge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50,000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Service charge if applicable
              </p>
            </FormField>
            <FormField label="Caution Fee (Optional)">
              <input
                type="text"
                name="caution_fee"
                value={displayCautionFee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="100,000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Caution/security deposit if applicable
              </p>
            </FormField>
          </>
        )}

        {formData.listing_type === "SALE" && (
          <>
            <FormField label="Sale Price" required>
              <input
                type="text"
                name="sale_price"
                value={displaySalePrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 150,000,000"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the base sale price.
                {formData.user_type === 'agent'
                  ? ' Agent commission (10%) will be added to this price.'
                  : ' No additional fees will be added to this price.'}
              </p>
            </FormField>
            <FormField label="Service Charge (Optional)">
              <input
                type="text"
                name="service_charge"
                value={displayServiceCharge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50,000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Service charge if applicable
              </p>
            </FormField>
            <FormField label="Caution Fee (Optional)">
              <input
                type="text"
                name="caution_fee"
                value={displayCautionFee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="100,000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Caution/security deposit if applicable
              </p>
            </FormField>
          </>
        )}
      </div>

      {/* Fee Breakdown */}
      {(formData.rent_price || formData.sale_price) && (
        <div className="mt-2 md:w-2/3">
          <FeeBreakdown
            fees={fees}
            userType={formData.user_type}
            listingType={formData.listing_type}
            rentFrequency={formData.rent_frequency}
            serviceCharge={formData.service_charge}
            cautionFee={formData.caution_fee}
          />
        </div>
      )}

      {/* Description and Location */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-[#014d98] mb-4">Address and Description</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Property Description" required>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
              placeholder="Describe your property's best features"
            />
          </FormField>
          <FormField label="Property Address" required>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
              placeholder="Provide the property address"
            />
          </FormField>
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

      {/* Upload New Media - Matching AddForRent and AddForSell */}
      <div className="mt-8">
        <h3 className="text-xl font-normal text-[#014d98]">Upload New Media</h3>
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
            inputId="image-upload-input-edit"
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

      {/* Property Documents - Matching AddForSell */}
      {formData.listing_type === "SALE" && (
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
              <h4 className="text-lg font-medium text-[#014d98] mb-3">Uploaded Documents</h4>
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
      )}

      {/* Features and Amenities - Matching AddForRent and AddForSell */}
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
                  checked={formData.amenities.includes(amenity.id)}
                  onChange={() => handleAmenityToggle(amenity.id)}
                />
                <span>{amenity.icon} {amenity.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
        <button
          type="button"
          onClick={() => initiateSubmit(true)}
          disabled={submitting}
          className="border-2 border-blue-500 text-blue-500 py-2 px-6 rounded-md hover:bg-blue-100 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save as draft'}
        </button>
        <button
          type="button"
          onClick={() => initiateSubmit(false)}
          disabled={submitting}
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-6 rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit for review'}
        </button>
      </div>

      {/* Modals - Matching AddForRent and AddForSell */}
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
            : "Are you sure you want to submit this property for review? Please verify that all information is correct."
        }
      />
    </div>
  );
};

export default EditProperty;