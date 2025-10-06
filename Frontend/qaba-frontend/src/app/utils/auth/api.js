import axios from 'axios';
import qs from 'qs';
import apiClient from '../../../utils/axiosConfig'; // Use configured axios with interceptors

export const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

// Register a new client
// Helper function to handle API errors properly
const handleApiError = (error) => {
  if (error.response && error.response.data) {
    // Return the error response from the API
    throw error.response.data;
  }
  throw new Error('Network error occurred');
};

export const registerClient = async (data) => {
  try {
    // Include confirmPassword as password_confirm in the API request
    const requestData = {
      ...data,
      password_confirm: data.confirmPassword
    };
    
    const response = await axios.post(`${API_BASE_URL}/auth/register/client/`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Register a new agent
export const registerAgent = async (data) => {
  try {
    // Include confirmPassword as password_confirm in the API request
    const requestData = {
      ...data,
      password_confirm: data.confirmPassword
    };
    
    const response = await axios.post(`${API_BASE_URL}/auth/register/agent/`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Register a new landlord
export const registerLandlord = async (data) => {
  try {
    const requestData = {
      ...data,
      password_confirm: data.confirmPassword
    };
    // Use the correct endpoint (no /auth/)
    const response = await axios.post(`${API_BASE_URL}/register/landlord/`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Send a verification email
export const sendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/send-email-verification/`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Sign in a user
export const signIn = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to sign in');
  }
};

// Verify an email
export const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/verify-email`, {
      params: {
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to verify email');
  }
};
// Reset password
export const resetPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/password-reset/`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to reset password');
  }
};

export const createProperty = async (data) => {
  try {
    // Convert data to URL-encoded format
    const formData = qs.stringify(data, {
      indices: false
    });

    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found. Please log in.');
    }

    const response = await axios.post(`${API_BASE_URL}/properties/`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`
      },
    });

    // Normalize the response to match your expected structure
    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    
    // More detailed error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        message: error.response.data?.message || 'Failed to create property',
        errors: error.response.data?.errors || {}
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        message: 'No response received from server. Please check your network connection.'
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        message: error.message || 'An unexpected error occurred'
      };
    }
  }
};