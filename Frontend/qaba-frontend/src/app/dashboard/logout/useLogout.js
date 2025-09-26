"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const useLogout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    
    // Clear user data immediately
    clearUserData();
    
    // Force a complete page refresh to clear all cached state
    // No API call needed - logout should be instant
    window.location.href = '/signin';
  };

  // Helper function to clear all user-related data
  const clearUserData = () => {
    // Clear authentication tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('authToken'); // Legacy token
    
    // Clear user profile data
    localStorage.removeItem('profile_photo_url');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_info');
    
    // Clear user type and roles
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    
    // Clear any additional session data
    localStorage.removeItem('session_data');
    localStorage.removeItem('last_login');
    
    // Clear cookies
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  };

  return { logout, isLoading };
};

export default useLogout;