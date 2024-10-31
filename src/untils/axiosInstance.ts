// src/utils/axiosInstance.ts

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://toptop-be.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Có thể thêm interceptor nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Interceptor config:", config); 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;