// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;
import axios from "axios";
// default import
import ENDPOINTS from "./endpoints";

const api = axios.create({
  baseURL: "http://localhost:5000", // default base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API calls
export const loginUser = async (data) => {
  return api.post(ENDPOINTS.LOGIN, data);
};

export const fetchDashboardData = async () => {
  return api.get("/dashboard/superadmin");
};

export const fetchHOAAdminDashboardData = async () => {
  return api.get("/admin-dashboard/admin");
};

export const fetchNotifications = async () => {
  return api.get(ENDPOINTS.NOTIFICATIONS);
};

export const fetchAnnouncements = async () => {
  return api.get(ENDPOINTS.ANNOUNCEMENTS);
};

export const fetchCommunity = async () => {
  return api.get("/communitities");
};

export default api;
