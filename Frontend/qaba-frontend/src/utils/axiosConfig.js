/**
 * Axios Configuration with Global Interceptors
 * Handles automatic 401 error detection and session expiration
 */

import axios from 'axios';
import { handleSessionExpiration, getAuthToken } from './authHandler';

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // Check if error response exists and has status 401
    if (error.response && error.response.status === 401) {
      console.error('401 Unauthorized - Session expired');
      
      // Handle session expiration
      handleSessionExpiration('Your session has expired. Please log in again.');
      
      // Return a rejected promise to stop further execution
      return Promise.reject(new Error('Session expired'));
    }
    
    // For other errors, just pass them through
    return Promise.reject(error);
  }
);

export default apiClient;

