/**
 * Utility functions for handling authentication and payment throughout the application
 */

// Get the authentication token from localStorage
export const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token') || localStorage.getItem('auth_token');
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };
  
  // Store payment information for verification after redirect
  export const storePaymentInfo = (txRef, propertyId) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('pendingTxRef', txRef);
    localStorage.setItem('pendingPropertyId', propertyId);
  };
  
  // Clear payment information after verification
  export const clearPaymentInfo = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('pendingTxRef');
    localStorage.removeItem('pendingPropertyId');
  };
  
  // Get stored payment reference
  export const getPendingPaymentRef = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('pendingTxRef');
  };
  
  // Store redirect URL for after login
  export const storeRedirectUrl = (url) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('redirectAfterLogin', url);
  };
  
  // Get redirect URL
  export const getRedirectUrl = () => {
    if (typeof window === 'undefined') return '/';
    return localStorage.getItem('redirectAfterLogin') || '/';
  };
  
  // Clear redirect URL
  export const clearRedirectUrl = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('redirectAfterLogin');
  };