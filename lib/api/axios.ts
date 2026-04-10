import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 MUHIM
});

// DEBUG (optional)
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.error("⛔ Unauthorized");

      if (typeof window !== "undefined") {
        window.location.href = "https://auth.enwis.uz";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
