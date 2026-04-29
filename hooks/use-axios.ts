import axiosInstance from "@/lib/axios";
import { useAccessTokenStore } from "@/store/access-token";

export default function useAxios() {
  const accessToken = useAccessTokenStore((state) => state.accessToken);
  return axiosInstance.create({
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}
