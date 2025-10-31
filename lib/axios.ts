// lib/axios.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * Single axios instance used by the app.
 * - Attaches access token from localStorage (or other store)
 * - Handles 401 by attempting a single refresh token call (queued)
 */

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
const failedQueue: {
  resolve: (value?: any) => void;
  reject: (err: any) => void;
  config: AxiosRequestConfig;
}[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else {
      if (token) p.config.headers = p.config.headers || {};
      if (token) p.config.headers["Authorization"] = `Bearer ${token}`;
      p.resolve(p.config);
    }
  });
  failedQueue.length = 0;
}

export function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    // You can add other defaults here
    timeout: 15000,
  });

  // Request interceptor — attach token
  instance.interceptors.request.use(
    (config) => {
      try {
        // Read token from localStorage (or consider a cookie or memory store)
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (err) {
        // ignore (SSR environment)
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor — refresh token flow
  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const originalConfig = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };
      if (!originalConfig) return Promise.reject(error);

      // If 401 and not already retried, try refresh
      if (error.response?.status === 401 && !originalConfig._retry) {
        if (isRefreshing) {
          // queue the request until refresh finishes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalConfig });
          }).then((cfg) => instance.request(cfg));
        }

        originalConfig._retry = true;
        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            // refresh token endpoint - implement on server
            const resp = await instance.post(
              "/auth/refresh",
              {},
              { withCredentials: true }
            );
            const newAccessToken = resp.data?.accessToken;
            if (newAccessToken) {
              try {
                localStorage.setItem("accessToken", newAccessToken);
              } catch (e) {
                // ignore storage issues
              }
            }
            return newAccessToken ?? null;
          } catch (refreshErr) {
            // If refresh failed: clear tokens
            try {
              localStorage.removeItem("accessToken");
            } catch (_) {}
            return null;
          } finally {
            isRefreshing = false;
          }
        })();

        try {
          const newToken = await refreshPromise;
          processQueue(null, newToken);
          if (!newToken) {
            // optionally redirect to login page here
            return Promise.reject(error);
          }
          // set header and retry original request
          originalConfig.headers = originalConfig.headers || {};
          originalConfig.headers["Authorization"] = `Bearer ${newToken}`;
          return instance.request(originalConfig);
        } catch (err2) {
          processQueue(err2, null);
          return Promise.reject(err2);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

// export a singleton
export const axiosInstance = createAxiosInstance();
