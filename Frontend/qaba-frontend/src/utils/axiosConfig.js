/**
 * Axios Configuration with Global Interceptors
 * Handles automatic 401 error detection, token refresh, and request retry
 * Now with PROACTIVE token refresh before requests
 */

import axios from 'axios';
import { handleSessionExpiration, getAuthToken, refreshAccessToken } from './authHandler';
import { isTokenExpiringSoon } from './jwt';

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
// PROACTIVE REFRESH: Check if token is expiring soon BEFORE making request
apiClient.interceptors.request.use(
  async (config) => {
    const token = getAuthToken();

    if (token) {
      // ✅ PROACTIVE CHECK: Is token expiring in less than 5 minutes?
      if (isTokenExpiringSoon(token, 5)) {
        console.log('Token expiring soon - refreshing proactively before request');

        try {
          const newToken = await refreshAccessToken();

          if (newToken) {
            // Use the new token for this request
            config.headers.Authorization = `Bearer ${newToken}`;
            console.log('✅ Token refreshed proactively - using new token');
          } else {
            // Refresh failed - use old token and let response interceptor handle it
            config.headers.Authorization = `Bearer ${token}`;
            console.warn('⚠️ Proactive refresh failed - proceeding with old token');
          }
        } catch (error) {
          console.error('Error during proactive token refresh:', error);
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        // Token is still fresh - use it normally
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors with automatic token refresh and retry
apiClient.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error response exists and has status 401
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true;
      
      console.warn('Axios interceptor: 401 detected, attempting token refresh');
      
      // Try to refresh the token
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // ✅ Token refresh successful - update authorization header and retry request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the original request with the new token
        return apiClient(originalRequest);
      } else {
        // ❌ Token refresh failed - logout user
        console.error('Token refresh failed - logging out user');
        handleSessionExpiration('Your session has expired. Please log in again.');
        
        // Return a rejected promise to stop further execution
        return Promise.reject(new Error('Session expired'));
      }
    }
    
    // For other errors, just pass them through
    return Promise.reject(error);
  }
);

export default apiClient;

