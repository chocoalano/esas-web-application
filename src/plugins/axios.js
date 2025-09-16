import axios from "axios";
import { useAuthStore } from "@/stores/auth/auth";
import router from "@/router";

const baseURL = import.meta.env.VITE_BASE_API || "http://localhost:3000";

// Buat instance Axios
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan flag agar logout hanya dipanggil sekali
let isLoggingOut = false;

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.isAuthenticated && authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error);

    if (error.response.status === 401) {
      localStorage.removeItem('authToken');
      isLoggingOut = true;

      const authStore = useAuthStore();
      authStore.logout();
      // Tunggu next tick supaya route change lebih mulus
      setTimeout(() => {
        router.push("/login");
        isLoggingOut = false; // Reset flag setelah redirect
      }, 100);
    }

    return Promise.reject(error);
  }
);

// Plugin Vue 3 untuk Axios
export default {
  install: (app) => {
    app.config.globalProperties.$axios = api;
    app.provide("axios", api);
  },
};

export { api };
