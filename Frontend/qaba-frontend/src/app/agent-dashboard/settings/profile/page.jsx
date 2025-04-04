"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera } from "lucide-react";
import Cookies from 'js-cookie';
import { useProfile } from "../../../../contexts/ProfileContext";
import { useNotifications } from "../../../../contexts/NotificationContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable Input Component
const FormInput = ({ 
  label, name, register, errors, type = "text", required = false, readOnly = false, value = "", className = "", colSpan = "" 
}) => {
  const validationRules = required ? { required: `${label} is required` } : {};
  return (
    <div className={colSpan}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {readOnly ? (
        <input
          type={type}
          value={value || ""}
          className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 ${className}`}
          readOnly
        />
      ) : (
        <>
          <input
            type={type}
            {...register(name, validationRules)}
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${className}`}
          />
          {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
        </>
      )}
    </div>
  );
};

export default function ProfilePage() {
  // Use shared profile context
  const { userData, profileImage, isLoading, error, fetchProfile, updateProfileImage, userType } = useProfile();
  
  // Use the notifications hook with fallback
  const notificationsContext = useNotifications();
  const createNotification = notificationsContext?.createNotification || (async (msg) => {
    console.log("Notification would be created (fallback):", msg);
    return true;
  });
  
  // State Management
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  
  // Form Management
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();
  
  // API Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qaba.onrender.com';

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
      const requestOptions = { method, headers, cache: 'no-store' };
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

  // Fetch profile image directly from the specific endpoint
  const fetchProfileImageDirectly = async () => {
    setImgLoading(true);
    
    try {
      // Use the specific profile endpoint based on user type
      const endpoint = userType === "AGENT" 
        ? '/api/v1/profile/agent/' 
        : '/api/v1/profile/client/';
      
      const response = await apiRequest(endpoint);
      const profileData = await response.json();
      
      // Handle image URL from response
      if (profileData?.data?.profile_photo_url) {
        // Get the raw URL from the API response
        const imageUrl = profileData.data.profile_photo_url;
        console.log("Got image URL from direct profile API:", imageUrl);
        
        // Update states and context with the raw URL
        setImagePreview(imageUrl);
        updateProfileImage(imageUrl);
        
        // Store the raw URL in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('profile_image_url', imageUrl);
        }
        
        setImgError(false);
      } else {
        console.log("No profile image found in profile data");
        setImagePreview(null);
      }
    } catch (err) {
      console.error("Error fetching profile image:", err);
      // Try fallback to locally stored URL if direct fetch fails
      const savedImage = localStorage.getItem('profile_image_url');
      if (savedImage && savedImage !== 'null' && savedImage !== 'undefined') {
        setImagePreview(savedImage);
      }
    } finally {
      setImgLoading(false);
    }
  };

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      console.log("userData received:", userData);
      
      // Set form values for user data
      ['first_name', 'last_name', 'phone_number'].forEach(field => {
        if (userData[field]) setValue(field, userData[field]);
      });
      
      // Specifically handle email
      const email = getEmailFromData(userData);
      console.log("Email found:", email);
      setValue('email', email);
      setUserEmail(email);
      
      // Set form values for profile data
      const profileData = userData.agent_profile || userData.client_profile || {};
      ['country', 'state', 'city', 'address'].forEach(field => {
        if (profileData[field]) setValue(field, profileData[field]);
      });
      
      // Fetch the image directly from the specific endpoint
      fetchProfileImageDirectly();
    }
  }, [userData, setValue]);

  // Fetch user email if not available in userData
  useEffect(() => {
    if (!userEmail && typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('user_email');
      if (storedEmail) {
        console.log("Using email from localStorage:", storedEmail);
        setUserEmail(storedEmail);
        setValue('email', storedEmail);
      }
    }
  }, [userEmail, setValue]);

  // Initial load of profile image on component mount
  useEffect(() => {
    if (!isLoading && (imgError || !imagePreview)) {
      fetchProfileImageDirectly();
    }
  }, [isLoading, imgError]);

  // API Operations
  const updateProfile = async (data, formType) => {
    try {
      let payload;
      
      if (formType === 'contact') {
        payload = { 
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number
        };
      } else if (formType === 'location') {
        const profileType = userType === "AGENT" ? "agent_profile" : "client_profile";
        payload = {
          [profileType]: {
            country: data.country,
            state: data.state,
            city: data.city,
            address: data.address
          }
        };
      }
      
      const response = await apiRequest('/api/v1/users/update', {
        method: 'PATCH',
        body: payload
      });
      
      await response.json();
      
      // Update global context
      await fetchProfile();
      
      // Create a notification
      await createNotification(`${formType === 'contact' ? 'Contact' : 'Location'} information updated successfully on ${new Date().toLocaleDateString()}`);
      
      toast.success(`${formType === 'contact' ? 'Contact' : 'Location'} information updated successfully`);
    } catch (err) {
      toast.error(err.message);
      console.error("Update error:", err);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return;
    
    try {
      // First, upload the image using the standard update endpoint
      const formData = new FormData();
      const profileType = userType === "AGENT" ? "agent_profile" : "client_profile";
      formData.append(`${profileType}.profile_photo`, selectedImage);
      
      const response = await apiRequest('/api/v1/users/update', {
        method: 'PATCH',
        isFormData: true,
        body: formData
      });
      
      const result = await response.json();
      console.log("Image upload result:", result);
      
      // After uploading, fetch the fresh image URL from the specific endpoint
      await fetchProfileImageDirectly();
      
      // Refresh profile data in the context
      await fetchProfile();
      
      // Create a notification
      await createNotification(`Profile photo updated successfully on ${new Date().toLocaleDateString()}`);
      
      setSelectedImage(null);
      toast.success("Profile photo updated successfully");
    } catch (err) {
      toast.error(err.message);
      console.error("Image upload error:", err);
    }
  };

  // Loading, Error and Empty States
  if (isLoading && !userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error && !userData) {
    return <div className="text-red-500 p-4 text-center">Error: {error}</div>;
  }
  
  if (!userData) return null;

  // Helper for UI
  const profileType = userType === "AGENT" ? "Agent" : "Client";

  // Render Component
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <h1 className="text-2xl font-bold mb-8">{profileType} Profile Settings</h1>

      {/* Profile Image Section */}
      <div className="mb-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
            {imagePreview && !imgError ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="object-cover w-full h-full"
                crossOrigin="anonymous" // Add this to handle potential CORS issues
                onError={(e) => {
                  console.log("Image loading error", e);
                  setImgError(true);
                  // Don't use the cached version when there's an error
                  e.target.onerror = null; // Prevent infinite error loop
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                {imgLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                ) : (
                  <span className="text-gray-500 text-sm">
                    {imgError ? "Unable to load image" : "No Image"}
                  </span>
                )}
              </div>
            )}
          </div>
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-600"
          >
            <Camera size={20} />
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
            onClick={uploadImage}
            className="mt-4 px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:opacity-90"
          >
            Upload Image
          </button>
        )}
        {imgError && (
          <button
            onClick={() => {
              fetchProfileImageDirectly();
            }}
            className="mt-2 px-3 py-1 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Reload Image
          </button>
        )}
      </div>

      {/* Contact Information Section */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        
        <form onSubmit={handleSubmit((data) => updateProfile(data, 'contact'))} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              value={userEmail || userData?.email || (typeof window !== 'undefined' ? localStorage.getItem('user_email') : '') || ''} 
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
              className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white px-4 py-2 rounded-md hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Contact Info'}
            </button>
          </div>
        </form>
      </div>

      {/* Location Information Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Location Information</h2>
        
        <form onSubmit={handleSubmit((data) => updateProfile(data, 'location'))} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white px-4 py-2 rounded-md hover:from-[#3ab7b1] hover:to-[#014d98] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Location Info'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 mb-6">
          <p>There was an issue connecting to the server: {error}</p>
          <p className="mt-1">Your profile is currently displaying locally saved data. Changes may not be saved until connection is restored.</p>
        </div>
      )}
    </div>
  );
}