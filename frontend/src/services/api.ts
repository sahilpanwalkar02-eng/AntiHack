import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('antihack_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration & 401s
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('antihack_refresh_token');
      
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh?refresh_token=${refreshToken}`);
          const { access_token, refresh_token: newRefreshToken } = res.data;
          
          localStorage.setItem('antihack_access_token', access_token);
          localStorage.setItem('antihack_refresh_token', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('antihack_access_token');
          localStorage.removeItem('antihack_refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
