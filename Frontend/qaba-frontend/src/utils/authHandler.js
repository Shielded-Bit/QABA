/**
 * Global Authentication Handler
 * Handles session expiration, token clearing, token refresh, and user redirection
 */

let isHandlingExpiration = false; // Prevent multiple simultaneous redirects
let isRefreshing = false; // Prevent multiple simultaneous refresh attempts
let refreshPromise = null; // Store ongoing refresh promise to prevent race conditions

/**
 * Clear all user-related data from storage
 */
export const clearAllUserData = () => {
  if (typeof window === 'undefined') return;

  // Clear authentication tokens
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('authToken');
  
  // Clear user profile data
  localStorage.removeItem('profile_photo_url');
  localStorage.removeItem('user_data');
  localStorage.removeItem('user_info');
  localStorage.removeItem('user_email');
  
  // Clear user type and roles
  localStorage.removeItem('user_type');
  localStorage.removeItem('user_id');
  localStorage.removeItem('role');
  
  // Clear session data
  localStorage.removeItem('session_data');
  localStorage.removeItem('last_login');
  localStorage.removeItem('profile_last_fetch');
  
  // Clear payment-related data
  localStorage.removeItem('pendingTxRef');
  localStorage.removeItem('pendingPropertyId');
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear all cookies
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
};

/**
 * Attempt to refresh the access token using the refresh token
 * Implements singleton pattern to prevent multiple simultaneous refresh attempts
 * @returns {Promise<string|null>} New access token or null if refresh failed
 */
export const refreshAccessToken = async () => {
  // If already refreshing, return the same promise
  if (isRefreshing && refreshPromise) {
    console.log('Token refresh already in progress, waiting for result...');
    return refreshPromise;
  }
  
  // Check if we have a refresh token
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  
  if (!refreshToken) {
    console.warn('No refresh token available - cannot refresh access token');
    return null;
  }
  
  // Mark as refreshing and create promise
  isRefreshing = true;
  
  refreshPromise = (async () => {
    try {
      console.log('Attempting to refresh access token...');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        console.error('Token refresh failed with status:', response.status);
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.access || data.data?.access;

      if (newAccessToken) {
        // Store the new access token
        localStorage.setItem('access_token', newAccessToken);
        console.log('✅ Access token refreshed successfully');
        return newAccessToken;
      }

      console.error('Token refresh response did not contain access token');
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    } finally {
      // Reset refresh state
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  
  return refreshPromise;
};

/**
 * Handle session expiration
 * Clears all data and redirects to sign-in page
 */
export const handleSessionExpiration = (message = 'Your session has expired. Please log in again.') => {
  if (typeof window === 'undefined') return;
  
  // Prevent multiple simultaneous calls
  if (isHandlingExpiration) {
    return;
  }
  
  isHandlingExpiration = true;
  
  console.warn('Session expired:', message);
  
  // Clear all user data
  clearAllUserData();
  
  // Store expiration message for sign-in page
  sessionStorage.setItem('session_expired_message', message);
  
  // Redirect to sign-in page
  window.location.href = '/signin?reason=expired';
  
  // Reset flag after a delay (in case redirect fails)
  setTimeout(() => {
    isHandlingExpiration = false;
  }, 2000);
};

/**
 * Handle 401 Unauthorized errors with automatic token refresh
 * @param {Response} response - The fetch response object
 * @param {Error} error - The error object (optional)
 * @returns {Promise<boolean>} - Returns true if 401 was handled successfully (token refreshed or user logged out)
 */
export const handle401Error = async (response, error = null) => {
  if (!response) return false;
  
  if (response.status === 401) {
    console.warn('401 Unauthorized detected - attempting token refresh');
    
    // Try to refresh the access token first
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      // ✅ Token refresh successful - user can continue
      console.log('Token refreshed successfully - user session extended');
      return true;
    }
    
    // ❌ Token refresh failed - now logout the user
    console.error('Token refresh failed - logging out user');
    const errorMessage = error?.message || 'Your session has expired. Please log in again.';
    handleSessionExpiration(errorMessage);
    return true;
  }
  
  return false;
};

/**
 * Check if user has a valid token
 * @returns {boolean}
 */
export const hasValidToken = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('access_token');
  return !!token;
};

/**
 * Get the current auth token
 * @returns {string|null}
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('access_token') || 
         localStorage.getItem('auth_token') || 
         null;
};

/**
 * Enhanced fetch wrapper with automatic 401 handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (url, options = {}) => {
  try {
    const token = getAuthToken();
    
    // Add authorization header if token exists
    const headers = {
      ...options.headers,
      'Content-Type': options.headers?.['Content-Type'] || 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle 401 errors
    if (response.status === 401) {
      handle401Error(response);
      throw new Error('Session expired');
    }
    
    return response;
  } catch (error) {
    // If it's a network error and we have a 401, handle it
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      handle401Error({ status: 401 }, error);
    }
    throw error;
  }
};

/**
 * Reset the expiration handling flag (use with caution)
 */
export const resetExpirationFlag = () => {
  isHandlingExpiration = false;
};

const authHandler = {
  clearAllUserData,
  handleSessionExpiration,
  handle401Error,
  hasValidToken,
  getAuthToken,
  authenticatedFetch,
  resetExpirationFlag,
  refreshAccessToken,
};

export default authHandler;

