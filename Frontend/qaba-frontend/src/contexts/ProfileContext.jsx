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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

  // Fetch user basic info (including name)
  const fetchUserInfo = useCallback(async () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const headers = getJsonHeaders();
      if (!headers) return null;

      const response = await fetch(`${API_BASE_URL}/api/v1/users/me/`, { headers });
      const userData = await handleApiError(response).json();
      
      return userData.data; // Extract the data object that contains user info
    } catch (err) {
      console.error("User info fetch error:", err);
      return null;
    }
  }, [API_BASE_URL, getJsonHeaders]);

  // Fetch profile data (including profile image)
  const fetchProfileData = useCallback(async () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const headers = getJsonHeaders();
      const currentUserType = getUserType();
      if (!headers) return null;

      const endpoint = currentUserType === "AGENT" 
        ? `${API_BASE_URL}/api/v1/profile/agent/`
        : `${API_BASE_URL}/api/v1/profile/client/`;

      const response = await fetch(endpoint, { headers });
      return await handleApiError(response).json();
    } catch (err) {
      console.error("Profile fetch error:", err);
      return null;
    }
  }, [API_BASE_URL, getJsonHeaders, getUserType]);

  // Fetch both user info and profile data
  const fetchProfile = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    // Check if user has a token - if not, don't try to fetch profile
    const token = getToken();
    if (!token) {
      setProfileData({
        userData: null,
        profileImage: null,
        isLoading: false,
        error: null, // No error - just no token available
      });
      return;
    }
    
    try {
      setProfileData(prev => ({ ...prev, isLoading: true }));
      
      // Fetch both user info and profile data in parallel
      const [userInfo, profileInfo] = await Promise.all([
        fetchUserInfo(),
        fetchProfileData()
      ]);
      
      // If both requests failed, try to use cached data
      if (!userInfo && !profileInfo) {
        throw new Error("Failed to fetch user data");
      }
      
      // Merge data from both endpoints
      const mergedData = {
        ...userInfo,
        ...profileInfo,
      };
      
      // Save to localStorage
      localStorage.setItem('user_data', JSON.stringify(mergedData));
      if (mergedData.email) localStorage.setItem('user_email', mergedData.email);

      // Get profile photo URL
      const profilePhotoUrl = profileInfo?.profile_photo_url || 
                             profileInfo?.agent_profile?.profile_photo_url || 
                             profileInfo?.client_profile?.profile_photo_url;

      if (profilePhotoUrl) {
        localStorage.setItem('profile_photo_url', profilePhotoUrl);
      }

      setProfileData({
        userData: mergedData,
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
  }, [fetchUserInfo, fetchProfileData, getToken]);

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
    // Only fetch profile if we're in the browser
    if (typeof window !== 'undefined') {
      fetchProfile();
    }
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