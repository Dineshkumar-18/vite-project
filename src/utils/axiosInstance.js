import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7055/api",
  withCredentials: true,
});

let setIsSessionExpired = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

const refreshToken = () => {
  return axiosInstance.post("/account/refresh-token");
};

export const configureInterceptors = (sessionExpiredSetter) => {
  setIsSessionExpired = sessionExpiredSetter;

  axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      // ❌ No response → network/server down
      if (!error.response) {
        return Promise.reject(error);
      }

      const status = error.response.status;
      const url = originalRequest.url;

      // ❌ Never retry refresh-token itself
      if (url.includes("/account/refresh-token")) {
        setIsSessionExpired?.(true);
        return Promise.reject(error);
      }

      // ❌ Do NOT refresh for /auth/me
      if (url.includes("/account/auth/me")) {
        return Promise.reject(error);
      }

      // ✅ Handle 401 for normal APIs
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // ⏳ Refresh already running → queue request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => axiosInstance(originalRequest));
        }

        isRefreshing = true;

        try {
          await refreshToken();          // 🔑 ONLY point of truth
          processQueue(null);
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          setIsSessionExpired?.(true);   // 🚨 ONLY HERE
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
