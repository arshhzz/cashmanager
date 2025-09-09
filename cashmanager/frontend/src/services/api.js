import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Accept all responses to handle them properly
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Request headers:', config.headers);
  } else {
    console.log('No token found in localStorage');
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    // Check if the response indicates an error
    if (response.data && !response.data.success) {
      console.log('Response indicates error:', response.data);
      return Promise.reject(new Error(response.data.message || 'Request failed'));
    }
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Auth error detected, clearing token');
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      
      // Only redirect if not already on signin page
      if (!window.location.pathname.includes('/signin')) {
        console.log('Redirecting to signin page');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/user/signup', userData),
  signin: (credentials) => api.post('/user/signin', credentials),
  getUsers: (searchFilter) => api.get(`/user/bulk?filter=${encodeURIComponent(searchFilter || '')}`),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user', data)
};

// Account API
export const accountAPI = {
  getBalance: () => api.get('/account/balance'),
  getTransactions: (page = 1, limit = 10) => 
    api.get(`/account/transactions?page=${page}&limit=${limit}`)
};

// Transaction API
export const transactionAPI = {
  sendMoney: (transferData) => api.post('/account/transfer', transferData)
};

export default api;