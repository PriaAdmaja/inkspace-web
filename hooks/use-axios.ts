import { API_ROUTES } from "@/constants/api-routes";
import axios from "@/lib/axios";
import { useAccessTokenStore } from "@/store/access-token";
import { useUserDataStore } from "@/store/user-data";
import { Response } from "@/types/app";

export default function useAxios() {
  const setUserData = useUserDataStore((state) => state.setUserData);
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);


  axios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error.response?.status;
      const url = error.config?.url;

      if (url !== API_ROUTES.AUTH.REFRESH && status === 401) {
        try {
          const res = await axios.post<Response<{ accessToken: string }>>(
            API_ROUTES.AUTH.REFRESH,
            {},
          );
          const newToken = res.data.data?.accessToken;

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

  axios.interceptors.request.use((config) => {
    const token = useAccessTokenStore.getState().accessToken;

    if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

    return config;
  });

  return axios;
}
