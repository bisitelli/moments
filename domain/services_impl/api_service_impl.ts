// src/domain/services/api_service_impl.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import qs from "qs";
import { ApiService } from "../services/api_service";

const BASE_URL =
  (process.env.EXPO_PUBLIC_API_URL || "https://api.campusconnect.com") + "/api";

// Simple refresh lock so we don't refresh multiple times in parallel
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

/**
 * Extend Axios config to support a per-request flag
 * - skipAuth: do not attach Authorization header and do not refresh on 401
 */
export type AuthedAxiosRequestConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
};

export class ApiServiceImpl implements ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      // Axios v1: paramsSerializer as object with serialize method
      paramsSerializer: {
        serialize: (params) =>
          qs.stringify(params, { arrayFormat: "repeat", skipNulls: true }),
      },
      timeout: 15000,
    });

    // ===== Request interceptor (attach token unless skipAuth) =====
    this.client.interceptors.request.use(
      async (config: AuthedAxiosRequestConfig) => {
        if (!config.skipAuth) {
          // const token = await AsyncStorage.getItem("access_token");
          const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqdWFuanVhbmdtb0BnbWFpbC5jb20iLCJpYXQiOjE3NjI3ODgwNjYsImV4cCI6MTc2Mjc4OTg2Nn0.fppWDAMP6dYzBb4oz7n4Gk5UE7_xsNYcv6NYclCcDzM"
          if (token) {
            config.headers = config.headers ?? {};
            // Use 'Authorization' capitalized — common requirement in many backends
            (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
          }
        }
        return config;
      }
    );

    // ===== Response interceptor (401 -> refresh once, unless skipAuth) =====
    this.client.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const status = error.response?.status;
        const original = error.config as (AuthedAxiosRequestConfig & { _retry?: boolean }) | undefined;

        // Only attempt refresh on 401 for authenticated requests, and only once
        if (status === 401 && original && !original._retry && !original.skipAuth) {
          original._retry = true;

          if (isRefreshing) {
            // Wait until the ongoing refresh finishes
            await new Promise<void>((resolve) => pendingRequests.push(resolve));
          } else {
            try {
              isRefreshing = true;
              await this.refreshToken();
            } finally {
              isRefreshing = false;
              // Let all queued requests continue
              pendingRequests.forEach((r) => r());
              pendingRequests = [];
            }
          }

          // Retry the original request with the new token
          const newToken = await AsyncStorage.getItem("access_token");
          if (newToken) {
            original.headers = original.headers ?? {};
            (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
          }
          return this.client.request(original);
        }

        // Other errors -> propagate
        return Promise.reject(error);
      }
    );
  }

  // ===== Refresh flow =====
  private async refreshToken(): Promise<void> {
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("Missing refresh token");

    // IMPORTANT: use skipAuth to avoid attaching Authorization and recursion
    const res = await this.client.post<{ accessToken: string; refreshToken?: string }>(
      "/auth/refresh-token",
      { refreshToken },
      { headers: { "Content-Type": "application/json" }, skipAuth: true } as AuthedAxiosRequestConfig
    );

    const data = res.data;
    if (!data?.accessToken) throw new Error("Token refresh failed");

    await AsyncStorage.setItem("access_token", data.accessToken);
    if (data.refreshToken) {
      await AsyncStorage.setItem("refresh_token", data.refreshToken);
    }
  }

  // ===== Public contract =====
  // _auth = true (default) -> authenticated call (adds token, refresh on 401)
  // _auth = false -> public call (no token, no refresh on 401)
  async get<T>(endpoint: string, params?: Record<string, unknown>, _auth = true): Promise<T> {
    const res = await this.client.get<T>(endpoint, {
      params,
      skipAuth: !_auth,
    } as AuthedAxiosRequestConfig);
    return res.data;
  }

  async post<T>(endpoint: string, body?: Record<string, unknown>, _auth = true): Promise<T> {
    const res = await this.client.post<T>(
      endpoint,
      body,
      { skipAuth: !_auth } as AuthedAxiosRequestConfig
    );
    return res.data;
  }

  async put<T>(endpoint: string, body?: Record<string, unknown>, _auth = true): Promise<T> {
    const res = await this.client.put<T>(
      endpoint,
      body,
      { skipAuth: !_auth } as AuthedAxiosRequestConfig
    );
    return res.data;
  }

  async delete<T>(endpoint: string, _auth = true): Promise<T> {
    const res = await this.client.delete<T>(
      endpoint,
      { skipAuth: !_auth } as AuthedAxiosRequestConfig
    );
    return res.data;
  }
}
