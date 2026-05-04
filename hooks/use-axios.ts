import { API_ROUTES } from "@/constants/api-routes";
import axios from "@/lib/axios";
import { useAccessTokenStore } from "@/store/access-token";
import { useUserDataStore } from "@/store/user-data";
import { Response } from "@/types/app";

const unallowedUrls = [API_ROUTES.AUTH.LOGOUT, API_ROUTES.AUTH.REFRESH];

export default function useAxios() {
  // Access the setUserData and setAccessToken functions from the stores
  const setUserData = useUserDataStore((state) => state.setUserData);
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);

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

  // Add a response interceptor to handle 401 errors and attempt token refresh
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

          setAccessToken(newToken);

          error.config.headers.Authorization = `Bearer ${newToken}`;
          error.config.withCredentials = true;

          return axios.request(error.config);
        } catch (err) {
          setAccessToken(null);
          setUserData(null);
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

  return axios;
}
