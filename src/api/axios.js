import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8765/api/v1",
  headers: {
    "Content-Type": "application/json"
  }
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("JWT expired or invalid — redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default instance;
