import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

// Load base API URL from environment variables, fallback to local development path
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.samratenterprises.com/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach authentication token if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('samrat_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle common global errors (like token expiry)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    const status = error.response ? error.response.status : null;
    
    if (status === 401) {
      console.warn('Authentication token expired or invalid. Redirecting to login...');
      // Optional: Clear storage and redirect
      localStorage.removeItem('samrat_auth_token');
      localStorage.removeItem('samrat_user_data');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
