/**
 * Global Authentication Handler
 * Handles session expiration, token clearing, and user redirection
 */

let isHandlingExpiration = false; // Prevent multiple simultaneous redirects

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
 * Handle 401 Unauthorized errors
 * @param {Response} response - The fetch response object
 * @param {Error} error - The error object (optional)
 * @returns {boolean} - Returns true if 401 was handled
 */
export const handle401Error = (response, error = null) => {
  if (!response) return false;
  
  if (response.status === 401) {
    const errorMessage = error?.message || 'Authentication expired. Please log in again.';
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
};

export default authHandler;

