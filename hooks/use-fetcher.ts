import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useFetcher<T>({
  endpoint,
  enable,
}: {
  endpoint: string;
  enable?: boolean;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  const hasFetched = useRef(false);
  const prevEndpoint = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get<T>(endpoint);

      setData(res.data);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (enable === false) return;
    if (prevEndpoint.current === endpoint && hasFetched.current) return;

    prevEndpoint.current = endpoint;
    hasFetched.current = true;
    fetchData();
  }, [enable, endpoint, fetchData]);

  return {
    isLoading,
    data,
    error,
  };
}
