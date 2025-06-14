import axios, { AxiosInstance } from "axios";

// Helper to extract CSRF token from cookies
function getCSRFToken(): string | null {
  const name = "csrftoken";
  const cookies = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(name + "="));

  return cookies ? decodeURIComponent(cookies.split("=")[1]) : null;
}

// Create configured Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "X-CSRFToken": getCSRFToken() || "",
    "Content-Type": "application/json",
  },
});

// Automatically update CSRF token before each request
apiClient.interceptors.request.use((config) => {
  config.headers["X-CSRFToken"] = getCSRFToken() || "";
  return config;
});

export default apiClient;
