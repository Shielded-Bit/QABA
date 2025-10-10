"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera, Edit, Check, X } from "lucide-react";
import Cookies from 'js-cookie';
import { useProfile } from "../../../../contexts/ProfileContext";
import { useNotifications } from "../../../../contexts/NotificationContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable Input Component with improved mobile styling
const FormInput = ({ 
  label, name, register, errors, type = "text", required = false, readOnly = false, value = "", className = "", colSpan = "" 
}) => {
  const validationRules = required ? { required: `${label} is required` } : {};
  return (
    <div className={`w-full mb-4 ${colSpan}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {readOnly ? (
        <input
          type={type}
          value={value || ""}
          className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:p-3 bg-gray-100 ${className}`}
          readOnly
        />
      ) : (
        <>
          <input
            type={type}
            {...register(name, validationRules)}
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 sm:p-3 ${className}`}
          />
          {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
        </>
      )}
    </div>
  );
};

// Profile Page Skeleton
const ProfilePageSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 animate-pulse">
    <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
    {/* Profile Image Skeleton */}
    <div className="mb-6 flex items-center">
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 border-2 border-gray-300 mr-6" />
      <div className="h-8 w-32 bg-gray-200 rounded" />
    </div>
    {/* Contact Info Skeleton */}
    <div className="mb-6 border-b pb-4">
      <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-md" />
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <div className="h-10 w-40 bg-gray-200 rounded" />
      </div>
    </div>
    {/* Location Info Skeleton */}
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="h-6 w-16 bg-gray-200 rounded" />
      </div>
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function ProfilePage() {
  // Use shared profile context
  const { userData, profileImage, isLoading, error, fetchProfile, updateProfileImage, userType } = useProfile();
  
  // Use the notifications hook with fallback
  const notificationsContext = useNotifications();
  const createNotification = notificationsContext?.createNotification || (async (msg) => {
    // Fallback notification handler
    return true;
  });
  
  // State Management
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [apiUserData, setApiUserData] = useState({
    id: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    user_type: '',
    is_email_verified: false
  });
  const [locationData, setLocationData] = useState({
    country: '',
    state: '',
    city: '',
    address: ''
  });
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  
  // Form Management
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm();
  
  // API Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Authentication and API Helpers
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return Cookies.get('access_token') || localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    }
    return null;
  };
  
  const getHeaders = (isFormData = false) => {
    const token = getToken();
    if (!token) throw new Error("Authentication required");
    
    const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" };
    if (!isFormData) headers["Content-Type"] = "application/json";
    return headers;
  };

  const apiRequest = async (endpoint, options = {}) => {
    const { method = 'GET', isFormData = false, body = null } = options;
    
    try {
      const headers = getHeaders(isFormData);
      const requestOptions = { method, headers, cache: 'default' };
      if (body) requestOptions.body = isFormData ? body : JSON.stringify(body);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
      
      if (!response.ok) {
        const status = response.status;
        if (status === 401) throw new Error("Session expired. Please login again");
        if (status === 415) throw new Error("Server doesn't support the provided data format");
        throw new Error(`Request failed (${status})`);
      }
      
      return response;
    } catch (err) {
      console.error(`API Request Error (${endpoint}):`, err);
      throw err;
    }
  };

  // Fetch user data from the provided endpoint
  const fetchUserData = async () => {
    try {
      const response = await apiRequest('/api/v1/users/me');
      const result = await response.json();
      
      if (result.success && result.data) {
        // Update state with the fetched user data
        setApiUserData(result.data);
        
        // Update form values with the fetched data
        if (result.data.first_name) setValue('first_name', result.data.first_name);
        if (result.data.last_name) setValue('last_name', result.data.last_name);
        if (result.data.email) {
          setValue('email', result.data.email);
          setUserEmail(result.data.email);
        }
        if (result.data.phone_number) setValue('phone_number', result.data.phone_number);
      } else {
        console.error("User data not found in response:", result);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // Manually check and set email from multiple sources
  const getEmailFromData = (data) => {
    // Try all possible places where email might be stored
    if (data?.email) {
      return data.email;
    } else if (data?.agent_profile?.email) {
      return data.agent_profile.email;
    } else if (data?.client_profile?.email) {
      return data.client_profile.email;
    } else if (typeof window !== 'undefined') {
      // Try fallback to locally stored email
      return localStorage.getItem('user_email') || '';
    }
    return '';
  };

  // Function to get complete image URL
  const getImageUrl = (imageUrl) => {
    // If the URL is already absolute or a data URL, return it as is
    if (!imageUrl || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
      return imageUrl;
    }
    
    // Check if the URL is already absolute
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Otherwise, ensure it's properly joined with the API base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Remove leading slash from imageUrl if it exists and the baseUrl ends with slash
    if (imageUrl.startsWith('/') && baseUrl.endsWith('/')) {
      imageUrl = imageUrl.substring(1);
    }
    
    // Add slash between baseUrl and imageUrl if needed
    if (!baseUrl.endsWith('/') && !imageUrl.startsWith('/')) {
      return `${baseUrl}/${imageUrl}`;
    }
    
    return `${baseUrl}${imageUrl}`;
  };

  // Fetch profile data including image and location from the profile endpoint
  const fetchProfileData = async () => {
    setImgLoading(true);
    
    try {
      // Determine the correct endpoint based on user type
      const endpoint = userType === "AGENT" 
        ? '/api/v1/profile/agent/' 
        : '/api/v1/profile/client/';
      
      const response = await apiRequest(endpoint);
      const profileData = await response.json();
      
      if (profileData?.success && profileData?.data) {
        
        // Extract location data - handle different possible structures
        const newLocationData = {
          country: profileData.data.country || '',
          state: profileData.data.state || '',
          city: profileData.data.city || '',
          address: profileData.data.address || ''
        };
        
        // Update location state
        setLocationData(newLocationData);
        
        // Update form values for location
        Object.entries(newLocationData).forEach(([field, value]) => {
          if (value) setValue(field, value);
        });
        
        // Handle profile image
        if (profileData.data.profile_photo_url) {
          const imageUrl = profileData.data.profile_photo_url;
          
          // Add cache-busting parameter
          const cacheBustUrl = imageUrl.includes('?') 
            ? `${imageUrl}&_cb=${new Date().getTime()}` 
            : `${imageUrl}?_cb=${new Date().getTime()}`;
          
          // Update state and context
          setImagePreview(cacheBustUrl);
          updateProfileImage(cacheBustUrl);
          
          // Store in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('profile_image_url', imageUrl);
          }
          
          setImgError(false);
        } else {
          setImagePreview(null);
        }
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
      // Fallback to stored image if available
      if (typeof window !== 'undefined') {
        const savedImage = localStorage.getItem('profile_image_url');
        if (savedImage && savedImage !== 'null' && savedImage !== 'undefined') {
          setImagePreview(savedImage);
        }
      }
    } finally {
      setImgLoading(false);
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
    fetchProfileData();
  }, []);

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      
      // Set form values for user data if not already set by API data
      if (!apiUserData.first_name && userData.first_name) setValue('first_name', userData.first_name);
      if (!apiUserData.last_name && userData.last_name) setValue('last_name', userData.last_name);
      if (!apiUserData.phone_number && userData.phone_number) setValue('phone_number', userData.phone_number);
      
      // Handle email if not already set
      if (!apiUserData.email) {
        const email = getEmailFromData(userData);
        setValue('email', email);
        setUserEmail(email);
      }
      
      // Set form values for profile data
      const profileData = userData.agent_profile || userData.client_profile || {};
      const newLocationData = {
        country: profileData.country || locationData.country,
        state: profileData.state || locationData.state,
        city: profileData.city || locationData.city,
        address: profileData.address || locationData.address
      };
      
      setLocationData(newLocationData);
      
      Object.entries(newLocationData).forEach(([field, value]) => {
        if (value) setValue(field, value);
      });
    }
  }, [userData, setValue, apiUserData]);

  // Fetch user email if not available in userData or apiUserData
  useEffect(() => {
    if (!userEmail && !apiUserData.email && typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('user_email');
      if (storedEmail) {
        setUserEmail(storedEmail);
        setValue('email', storedEmail);
      }
    }
  }, [userEmail, setValue, apiUserData]);

  // API Operations
  const updateProfile = async (data, formType) => {
    try {
      // Use the new endpoint for contact information updates, otherwise use the standard endpoint
      const endpoint = formType === 'contact' 
        ? '/api/v1/users/update'  // New endpoint for contact info
        : userType === "AGENT" 
          ? '/api/v1/profile/agent/' 
          : '/api/v1/profile/client/';  // Standard endpoints for other profile updates (like location)

      if (formType === 'contact') {
        // Send JSON for contact info
        const body = {
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
        };
        const response = await apiRequest(endpoint, {
          method: 'PATCH',
          isFormData: false,
          body,
        });
        const result = await response.json();
        if (result.success) {
          toast.success('Contact information updated successfully');
          await createNotification(`Contact information updated successfully on ${new Date().toLocaleDateString()}`);
          await fetchProfile();
        } else {
          toast.error(result.message || 'Failed to update contact information');
        }
      } else if (formType === 'location') {
        // Use FormData for location info
        const formData = new FormData();
        formData.append('country', data.country);
        formData.append('state', data.state);
        formData.append('city', data.city);
        formData.append('address', data.address);
        const response = await apiRequest(endpoint, {
          method: 'PATCH',
          isFormData: true,
          body: formData,
        });
        const result = await response.json();
        if (result.success) {
          toast.success('Location information updated successfully');
          await createNotification && createNotification(`Location information updated successfully on ${new Date().toLocaleDateString()}`);
          await fetchProfile();
          await fetchProfileData();
          setIsEditingLocation(false);
        } else {
          toast.error(result.message || 'Failed to update location information');
        }
      }
    } catch (err) {
      toast.error(err.message);
      console.error('Update error:', err);
    }
  };

  // Function to handle starting the edit mode for location
  const startLocationEdit = () => {
    // Make sure form has the latest location data
    Object.entries(locationData).forEach(([field, value]) => {
      setValue(field, value);
    });
    setIsEditingLocation(true);
  };

  // Function to cancel editing location
  const cancelLocationEdit = () => {
    // Reset form values to the current location data
    Object.entries(locationData).forEach(([field, value]) => {
      setValue(field, value);
    });
    setIsEditingLocation(false);
  };

  // Updated method to upload profile image
  const uploadProfileImage = async () => {
    if (!selectedImage) return;
    
    try {
      // Show upload in progress notification
      toast.info("Uploading profile photo...");
      
      // Create FormData object for multipart/form-data
      const formData = new FormData();
      
      // Append file with the correct field name
      formData.append('profile_photo', selectedImage);
      
      // Determine the correct endpoint based on user type
      const endpoint = userType === "AGENT" 
        ? '/api/v1/profile/agent/' 
        : '/api/v1/profile/client/';
      
      // Send PATCH request to update profile photo
      const response = await apiRequest(endpoint, {
        method: 'PATCH',
        isFormData: true,
        body: formData
      });
      
      const result = await response.json();
      
      // Reset selected image state
      setSelectedImage(null);
      
      // Fetch updated profile data after successful upload
      await fetchProfileData();
      
      // Update global context
      await fetchProfile();
      
      // Create notification
      await createNotification(`Profile photo updated successfully on ${new Date().toLocaleDateString()}`);
      
      // Show success notification
      toast.success("Profile photo updated successfully");
    } catch (err) {
      toast.error(`Failed to upload profile photo: ${err.message}`);
      console.error("Profile photo upload error:", err);
    }
  };

  // Loading, Error and Empty States
  if (isLoading && !userData && !apiUserData.id) {
    return <ProfilePageSkeleton />;
  }
  
  if (error && !userData && !apiUserData.id) {
    return <div className="text-red-500 p-4 text-center">Error: {error}</div>;
  }
  
  if (!userData && !apiUserData.id) return null;

  // Render Component
  return (
    <div className="h-full p-4 lg:p-6">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <h1 className="text-2xl font-bold mb-6">
        Profile Settings
      </h1>

      {/* Profile Image Section */}
      <div className="mb-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
            {imagePreview && !imgError ? (
              <img
                src={getImageUrl(imagePreview)}
                alt="Profile"
                className="object-cover w-full h-full"
                crossOrigin="anonymous"
                onError={(e) => {
                  setImgError(true);
                  e.target.onerror = null;
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                {imgLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-500 border-t-transparent"></div>
                ) : (
                  <span className="text-gray-500 text-xs sm:text-sm">
                    {imgError ? "Unable to load image" : "No Image"}
                  </span>
                )}
              </div>
            )}
          </div>
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 bg-blue-500 p-1 sm:p-2 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-600"
          >
            <Camera size={16} className="sm:w-5 sm:h-5" />
          </label>
          <input
            type="file"
            id="profile-image"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedImage(file);
                setImagePreview(URL.createObjectURL(file));
                setImgError(false);
              }
            }}
            accept="image/*"
          />
        </div>
        {selectedImage && (
          <button
            onClick={uploadProfileImage}
            className="mt-4 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:opacity-90"
          >
            Upload Image
          </button>
        )}
        {imgError && (
          <button
            onClick={fetchProfileData}
            className="mt-2 px-2 py-1 text-xs sm:text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Reload Image
          </button>
        )}
      </div>

      {/* Contact Information Section */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-3">Address</h2>
        
        <form onSubmit={handleSubmit((data) => updateProfile(data, 'contact'))} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
            <FormInput 
              label="First Name" 
              name="first_name" 
              register={register} 
              errors={errors} 
              required={true} 
            />
            
            <FormInput 
              label="Last Name" 
              name="last_name" 
              register={register} 
              errors={errors} 
              required={true} 
            />
            
            <FormInput 
              label="Email" 
              name="email" 
              type="email" 
              readOnly={true} 
              value={apiUserData.email || userEmail || userData?.email || (typeof window !== 'undefined' ? localStorage.getItem('user_email') : '') || ''} 
            />
            
            <FormInput 
              label="Phone Number" 
              name="phone_number" 
              type="tel" 
              register={register} 
              errors={errors} 
              required={true} 
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white px-4 py-2 rounded-md hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Contact Info'}
            </button>
          </div>
        </form>
      </div>

      {/* Location Information Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg sm:text-xl font-semibold">Location Information</h2>
          
          {!isEditingLocation && (
            <button
              onClick={startLocationEdit}
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <Edit size={16} className="mr-1" /> Edit
            </button>
          )}
        </div>
        
        {isEditingLocation ? (
          <form onSubmit={handleSubmit((data) => updateProfile(data, 'location'))} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
              <FormInput 
                label="Country" 
                name="country" 
                register={register} 
                errors={errors} 
              />
              
              <FormInput 
                label="State" 
                name="state" 
                register={register} 
                errors={errors} 
              />
              
              <FormInput 
                label="City" 
                name="city" 
                register={register} 
                errors={errors} 
              />
              
              <FormInput 
                label="Address" 
                name="address" 
                register={register} 
                errors={errors} 
                colSpan="md:col-span-2" 
              />
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelLocationEdit}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center"
              >
                <X size={16} className="mr-1" /> Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white px-4 py-2 rounded-md hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? 'Saving...' : (
                  <>
                    <Check size={16} className="mr-1" /> Save Location
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Country</p>
                <p className="mt-1">{locationData.country || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">State</p>
                <p className="mt-1">{locationData.state || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">City</p>
                <p className="mt-1">{locationData.city || 'Not specified'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="mt-1">{locationData.address || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 mb-6">
          <p>There was an issue connecting to the server: {error}</p>
          <p className="mt-1">Your profile is currently displaying locally saved data. Changes may not be saved until connection is restored.</p>
        </div>
      )}
    </div>
  );
}