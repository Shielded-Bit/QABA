import axios from 'axios';

const API_BASE_URL = 'https://qaba.onrender.com/api/v1/auth';

// Register a new client
export const registerClient = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/client/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to register client');
  }
};

// Register a new agent
export const registerAgent = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/agent/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to register agent');
  }
};

// Send a verification email
export const sendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-email-verification/`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to send verification email');
  }
};

// Sign in a user
export const signIn = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/`, data, {
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
    const response = await axios.get(`${API_BASE_URL}/verify-email`, {
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
    const response = await axios.post(`${API_BASE_URL}/password-reset/`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to reset password');
  }
};

