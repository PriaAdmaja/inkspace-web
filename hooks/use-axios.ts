import axiosInstance from "@/lib/axios";
import { useAccessTokenStore } from "@/store/access-token";

export default function useAxios() {
  const accessToken = useAccessTokenStore((state) => state.accessToken);
  const axios = axiosInstance.create({
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.request.use(
    (config) => {
      console.log(accessToken)
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axios;
}
