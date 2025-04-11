"use client";

import { useRouter } from "next/navigation";

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      // Get the access token from localStorage or wherever it's stored
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        console.error('No access token found');
        // Clear any remaining user data
        clearUserData();
        router.push('/signin');
        return;
      }

      // Make a POST request to the logout endpoint with the access token
      const response = await fetch(`${process.env.NEXT_PUBLIC_API || 'https://qaba.onrender.com'}/api/v1/auth/logout/`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        console.log('Logout successful');
      } else {
        console.error('Logout failed:', response.status);
      }
      
      // Clear user data regardless of API response
      clearUserData();
      
      // Redirect to signin page
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear data and redirect even if there's an exception
      clearUserData();
      router.push('/signin');
    }
  };

  // Helper function to clear all user-related data
  const clearUserData = () => {
    // Clear authentication tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Clear user profile data
    localStorage.removeItem('profile_photo_url');
    localStorage.removeItem('user_data');
    
    // Clear any additional user-related data
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    
    // If using cookies, you might want to clear them as well
    // This would typically be handled by the backend, but as a fallback:
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  };

  return { logout };
};

export default useLogout;