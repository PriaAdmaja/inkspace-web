import { API_ROUTES } from "@/constants/api-routes";
import { useAccessTokenStore } from "@/store/access-token";
import { useUserDataStore } from "@/store/user-data";
import { Response } from "@/types/app";
import axiosLib from "axios";

const axios = axiosLib.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
  withCredentials: true,
});

// Function to get a new access token using the refresh token
const getNewAccessToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post<Response<{ accessToken: string }>>(
      API_ROUTES.AUTH.REFRESH,
      {},
    );
    return res.data.data?.accessToken || null;
  } catch (error) {
    throw error;
  }
};

const unallowedUrls = [API_ROUTES.AUTH.LOGOUT, API_ROUTES.AUTH.REFRESH];

axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (
      unallowedUrls.some((u) => String(url).includes(u)) === false &&
      status === 401
    ) {
      try {
        const newToken = await getNewAccessToken();

        if (!newToken) {
          throw new Error("No access token returned");
        }
        useAccessTokenStore.getState().setAccessToken(newToken);

        error.config.headers.Authorization = `Bearer ${newToken}`;
        error.config.withCredentials = true;

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

// Add a request interceptor to include the access token in the Authorization header
axios.interceptors.request.use(async (config) => {
  let token = useAccessTokenStore.getState().accessToken;

  if (token) {
    let payload: { exp: number } | null = null;

    try {
      payload = JSON.parse(atob(token.split(".")[1]));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      token = null;
      useAccessTokenStore.getState().setAccessToken(null);
    }

    if (payload) {
      const isTokenExpired = payload?.exp
        ? payload.exp * 1000 < Date.now() + 60 * 1000
        : true;

      const url = config.url;

      if (
        isTokenExpired &&
        unallowedUrls.some((u) => String(url).includes(u)) === false
      ) {
        const newToken = await getNewAccessToken();

        if (newToken) {
          token = newToken;
          useAccessTokenStore.getState().setAccessToken(newToken);
        } else {
          token = null;
          useAccessTokenStore.getState().setAccessToken(null);
        }
      }
    }
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axios;
