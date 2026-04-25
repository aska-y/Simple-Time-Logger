import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8000',
  baseURL: API_URL,
  withCredentials: true, // Cookieを付与
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 2000,
});

export default axiosInstance;
