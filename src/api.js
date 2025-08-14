import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem(REFRESH_TOKEN)
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        );
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
