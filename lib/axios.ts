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

    if (unallowedUrls.includes(url) === false && status === 401) {
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
  const token = useAccessTokenStore.getState().accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axios;
