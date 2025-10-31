// lib/apiClient.ts
import { axiosInstance } from "./axios";
import type { AxiosRequestConfig } from "axios";

export type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    status?: number;
    details?: any;
  };
};

export async function apiRequest<T = any>(
  config: AxiosRequestConfig
): Promise<ApiResult<T>> {
  try {
    const resp = await axiosInstance.request<T>(config);
    return { success: true, data: resp.data };
  } catch (err: any) {
    // normalize error
    const isAxios = err?.isAxiosError;
    if (isAxios) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "Request failed";
      return {
        success: false,
        error: { message, status, details: err.response?.data },
      };
    }
    return {
      success: false,
      error: { message: err?.message || "Unknown error" },
    };
  }
}
