"use client";
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { handle401Error } from '../utils/authHandler';

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

  // Fetch user data from /me endpoint (includes profile image)
  const fetchUserData = useCallback(async () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const headers = getJsonHeaders();
      if (!headers) return null;

      const response = await fetch(`${API_BASE_URL}/api/v1/users/me/`, { headers });
      
      // Handle 401 errors (session expired)
      if (response.status === 401) {
        handle401Error(response, new Error('Session expired while fetching user data'));
        return null;
      }
      
      const result = await handleApiError(response).json();
      
      if (result.success && result.data) {
        return result.data; // This contains user info + profile image
      }
      return null;
    } catch (err) {
      console.error("User data fetch error:", err);
      return null;
    }
  }, [API_BASE_URL, getJsonHeaders]);

  // Fetch profile data (for additional profile fields if needed)
  const fetchProfileData = useCallback(async () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const headers = getJsonHeaders();
      const currentUserType = getUserType();
      if (!headers) return null;

      let endpoint;
      if (currentUserType === "AGENT" || currentUserType === "LANDLORD") {
        endpoint = `${API_BASE_URL}/api/v1/profile/agent/`;
      } else {
        endpoint = `${API_BASE_URL}/api/v1/profile/client/`;
      }

      const response = await fetch(endpoint, { headers });
      
      // Handle 401 errors (session expired)
      if (response.status === 401) {
        handle401Error(response, new Error('Session expired while fetching profile data'));
        return null;
      }
      
      return await handleApiError(response).json();
    } catch (err) {
      console.error("Profile fetch error:", err);
      return null;
    }
  }, [API_BASE_URL, getJsonHeaders, getUserType]);

  // Fetch user data and optionally merge with profile data
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
      
      // Fetch user data from /me endpoint (this includes profile image)
      const userData = await fetchUserData();
      
      if (!userData) {
        throw new Error("Failed to fetch user data");
      }
      
      // Extract profile image from user data
      const profilePhotoUrl = userData.profile?.profile_photo_url;
      
      // Save to localStorage
      localStorage.setItem('user_data', JSON.stringify(userData));
      if (userData.email) localStorage.setItem('user_email', userData.email);
      if (userData.user_type) localStorage.setItem('user_type', userData.user_type);

      if (profilePhotoUrl) {
        localStorage.setItem('profile_photo_url', profilePhotoUrl);
      }

      // Set the last fetch timestamp
      localStorage.setItem('profile_last_fetch', new Date().getTime().toString());

      setProfileData({
        userData: userData,
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
  }, [fetchUserData, getToken]);

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
      // First, try to load from localStorage for immediate display
      const savedData = localStorage.getItem('user_data');
      const savedImageUrl = localStorage.getItem('profile_photo_url');
      const savedUserType = localStorage.getItem('user_type');
      
      if (savedData && savedUserType) {
        try {
          const parsedData = JSON.parse(savedData);
          setProfileData({
            userData: parsedData,
            profileImage: savedImageUrl || null,
            isLoading: false,
            error: null,
          });
          
          // Only fetch fresh data if localStorage is stale (older than 5 minutes)
          const lastFetch = localStorage.getItem('profile_last_fetch');
          const now = new Date().getTime();
          const fiveMinutes = 5 * 60 * 1000;
          
          if (!lastFetch || (now - parseInt(lastFetch)) > fiveMinutes) {
            fetchProfile();
          }
        } catch (parseErr) {
          console.error("Error parsing saved data:", parseErr);
          fetchProfile();
        }
      } else {
        fetchProfile();
      }
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