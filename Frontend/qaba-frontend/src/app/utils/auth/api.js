import axios from 'axios';

const API_BASE_URL = 'https://qaba.onrender.com/api/v1/auth';

export const registerClient = async (data) => {
  return axios.post(`${API_BASE_URL}/register/client/`, data);
};

export const registerAgent = async (data) => {
  return axios.post(`${API_BASE_URL}/register/agent/`, data);
};
export const signIn = async (data) => {
  return axios.post(`${API_BASE_URL}/login/`, data);
};