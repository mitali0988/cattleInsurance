import axios from 'axios';
import tokenService from './tokenService';
import store from '@/store';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use((config) => {
  const token = tokenService.getToken(); // Retrieve token from storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  store.dispatch('loader/showLoader'); // Show loader via Vuex
  return config;
}, (error) => {
  store.dispatch('loader/hideLoader'); // Hide loader on error
  return Promise.reject(error);
});

// Response interceptor to handle caching if needed
api.interceptors.response.use(
  (response) => {
    store.dispatch('loader/hideLoader');
    // Additional processing of responses can go here if needed
    return response;
  },
  (error) =>{
    store.dispatch('loader/hideLoader');
    Promise.reject(error)
  } 
);

export default api;
