import axiosLib from "axios";
import { API_ROUTES } from "@/constants/api-routes";
import { useAccessTokenStore } from "@/store/access-token";
import { useUserDataStore } from "@/store/user-data";
import { Response } from "@/types/app";

const axios = axiosLib.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
  withCredentials: true,
});

const unallowedUrls = [API_ROUTES.AUTH.LOGOUT, API_ROUTES.AUTH.REFRESH];

// 🔁 shared refresh state (used by BOTH interceptors)
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// ======================
// 🔐 REFRESH FUNCTION
// ======================
const getNewAccessToken = async (): Promise<string | null> => {
  const res = await axios.post<Response<{ accessToken: string }>>(
    API_ROUTES.AUTH.REFRESH,
    {},
  );

  return res.data.data?.accessToken || null;
};

// ======================
// 🧠 HELPERS
// ======================
const isUnallowed = (url?: string) =>
  unallowedUrls.some((u) => url?.includes(u));

const decodeToken = (token: string): { exp: number } | null => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const isTokenExpiring = (exp?: number, buffer = 60_000) => {
  if (!exp) return true;
  return exp * 1000 < Date.now() + buffer;
};

// ======================
// 🔄 REQUEST INTERCEPTOR
// ======================
axios.interceptors.request.use(async (config) => {
  let token = useAccessTokenStore.getState().accessToken;
  const url = config.url;

  if (token && !isUnallowed(url)) {
    const payload = decodeToken(token);

    if (!payload) {
      token = null;
      useAccessTokenStore.getState().setAccessToken(null);
    } else if (isTokenExpiring(payload.exp)) {
      try {
        // 🔥 shared refresh queue
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = getNewAccessToken().finally(() => {
            isRefreshing = false;
          });
        }

        const newToken = await refreshPromise;

        if (!newToken) throw new Error("No token");

        token = newToken;
        useAccessTokenStore.getState().setAccessToken(newToken);
      } catch {
        token = null;
        useAccessTokenStore.getState().setAccessToken(null);
        useUserDataStore.getState().setUserData(null);

        return Promise.reject("Session expired");
      }
    }
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ======================
// 🔁 RESPONSE INTERCEPTOR
// ======================
axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (!isUnallowed(url) && status === 401) {
      try {
        // 🔥 reuse SAME refresh queue
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = getNewAccessToken().finally(() => {
            isRefreshing = false;
          });
        }

        const newToken = await refreshPromise;

        if (!newToken) throw new Error("No token");

        useAccessTokenStore.getState().setAccessToken(newToken);

        error.config.headers = error.config.headers || {};
        error.config.headers.Authorization = `Bearer ${newToken}`;

        return axios.request(error.config);
      } catch (err) {
        useAccessTokenStore.getState().setAccessToken(null);
        useUserDataStore.getState().setUserData(null);

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default axios;