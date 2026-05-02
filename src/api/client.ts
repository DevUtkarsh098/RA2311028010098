import axios from 'axios';

// Create a generic axios instance for the test server
export const apiClient = axios.create({
  baseURL: 'http://20.207.122.201',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
