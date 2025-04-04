"use client";
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profileData, setProfileData] = useState({
    userData: null,
    profileImage: null,
    isLoading: true,
    error: null,
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qaba.onrender.com';

  // Safe access to browser storage
  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }, []);
  
  const getUserType = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_type');
    }
    return null;
  }, []);

  const getJsonHeaders = useCallback(() => {
    const token = getToken();
    return token ? { 
      "Authorization": `Bearer ${token}`, 
      "Accept": "application/json", 
      "Content-Type": "application/json" 
    } : null;
  }, [getToken]);

  const handleApiError = (response) => {
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return response;
  };

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (typeof window === 'undefined') return; // Don't run on server
    
    try {
      setProfileData(prev => ({ ...prev, isLoading: true }));
      const headers = getJsonHeaders();
      const currentUserType = getUserType();

      if (!headers) {
        setProfileData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const endpoint = currentUserType === "AGENT" 
        ? `${API_BASE_URL}/api/v1/profile/agent/`
        : `${API_BASE_URL}/api/v1/profile/client/`;

      const response = await fetch(endpoint, { headers });
      const data = await handleApiError(response).json();

      localStorage.setItem('user_data', JSON.stringify(data));
      if (data.email) localStorage.setItem('user_email', data.email);

      const profilePhotoUrl = data?.profile_photo_url || 
                             data?.agent_profile?.profile_photo_url || 
                             data?.client_profile?.profile_photo_url;

      if (profilePhotoUrl) {
        localStorage.setItem('profile_photo_url', profilePhotoUrl);
      }

      setProfileData({
        userData: data,
        profileImage: profilePhotoUrl ? `${profilePhotoUrl}?t=${new Date().getTime()}` : null,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
      setProfileData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message 
      }));

      // Try to use cached data if available
      if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('user_data');
        const savedImageUrl = localStorage.getItem('profile_photo_url');

        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            setProfileData(prev => ({ 
              ...prev, 
              userData: parsedData,
              profileImage: savedImageUrl ? `${savedImageUrl}?t=${new Date().getTime()}` : null,
            }));
          } catch (parseErr) {
            console.error("Error parsing saved data:", parseErr);
          }
        }
      }
    }
  }, [API_BASE_URL, getJsonHeaders, getUserType]);

  // Update profile data correctly
  const updateProfileData = useCallback((newData) => {
    if (typeof window === 'undefined') return;
    
    setProfileData(prev => {
      const updatedData = { ...prev.userData, ...newData };
      localStorage.setItem('user_data', JSON.stringify(updatedData));
      return { ...prev, userData: updatedData };
    });
  }, []);

  // Update profile image
  const updateProfileImage = useCallback((imageUrl) => {
    if (typeof window === 'undefined') return;
    
    setProfileData(prev => ({
      ...prev,
      profileImage: imageUrl ? `${imageUrl}?t=${new Date().getTime()}` : null,
    }));
    
    if (imageUrl) {
      localStorage.setItem('profile_photo_url', imageUrl);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const value = {
    ...profileData,
    fetchProfile,
    updateProfileData,
    updateProfileImage,
    userType: getUserType(),
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}