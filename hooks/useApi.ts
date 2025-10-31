// hooks/useApi.ts
"use client";
import { useCallback, useState } from "react";
import type { AxiosRequestConfig } from "axios";
import { apiRequest, type ApiResult } from "@/lib/apiClient";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiResult<any>["error"] | null>(null);

  const request = useCallback(
    async <T = any>(config: AxiosRequestConfig): Promise<ApiResult<T>> => {
      setLoading(true);
      setError(null);
      const res = await apiRequest<T>(config);
      if (!res.success) setError(res.error ?? null);
      setLoading(false);
      return res;
    },
    []
  );

  return { request, loading, error };
}
