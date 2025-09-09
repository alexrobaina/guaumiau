import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment configuration - will be properly configured later
const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://api.cruxclimb.app';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for timeout handling
    (config as any).metadata = { startTime: new Date().getTime() };

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  response => {
    // Log request duration in development
    if (process.env.NODE_ENV === 'development') {
      const duration =
        new Date().getTime() - (response.config as any).metadata.startTime;
      console.log(
        `${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${duration}ms`
      );
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          await AsyncStorage.setItem('accessToken', data.accessToken);
          await AsyncStorage.setItem('refreshToken', data.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        // Navigate to login - will be handled by navigation
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

// Typed API methods
export const apiClient = {
  get: <T = any>(url: string, config?: any) =>
    api.get<T>(url, config).then(res => res.data),

  post: <T = any>(url: string, data?: any, config?: any) =>
    api.post<T>(url, data, config).then(res => res.data),

  put: <T = any>(url: string, data?: any, config?: any) =>
    api.put<T>(url, data, config).then(res => res.data),

  patch: <T = any>(url: string, data?: any, config?: any) =>
    api.patch<T>(url, data, config).then(res => res.data),

  delete: <T = any>(url: string, config?: any) =>
    api.delete<T>(url, config).then(res => res.data),
};
