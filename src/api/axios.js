import axios from "axios";
import { BASE_URL } from "./urls";


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  transformResponse: [
    (data) => {
      if (!data) return {};
      try {
        return JSON.parse(data);
      } catch (err) {
        console.warn("Axios: response not JSON, returning raw data", data);
        return data;
      }
    },
  ],
});

// ✅ Safe token handling
api.interceptors.request.use(
  (config) => {
    let token = null;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr && userStr !== "undefined") {
        const parsed = JSON.parse(userStr);
        token = parsed?.token || null;
      }
    } catch (err) {
      console.warn("Invalid user data in localStorage", err);
    }

    if (token) {
  console.log("🔑 Sending token:", token); // debug
  config.headers["Authorization"] = `Bearer ${token}`;
}
    return config;
  },
  (error) => Promise.reject(error)
);

export const API_IMAGE_URL = `${BASE_URL}/images/`;

export default api;
