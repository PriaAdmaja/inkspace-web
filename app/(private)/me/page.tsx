"use client";

import { API_ROUTES } from "@/constants/api-routes";
import useAxios from "@/hooks/use-axios";
import { Response } from "@/types/app";
import { MeResponse, UserData } from "@/types/me";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const axios = useAxios();
  const fetchMeData = useCallback(async () => {
    try {
      const response = await axios.get<Response<MeResponse>>(API_ROUTES.ME.GET);
      return response.data?.data?.user || null;
    } catch (error) {
      const message =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch user data.";
      toast.error(message);
    }
  }, [axios]);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchMeData();
      if (data) {
        setUserData(data);
      }
    };
    getUserData();
  }, []);

  return <div>{userData && <div>{userData.email}</div>}</div>;
}
