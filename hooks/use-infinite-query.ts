import axios from "@/lib/axios";
import { Response } from "@/types/app";
import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";

type UseInfiniteQueryFnProps = {
  endpoint: string;
  queryKey: QueryKey;
  queryParams?: object;
};

export default function useInfiniteQueryFn<T>({
  endpoint,
  queryKey,
  queryParams,
}: UseInfiniteQueryFnProps) {
  const additionalQuery = queryParams ? paramBuilder(queryParams) : null;

  const fetcher = async ({ pageParam }: { pageParam: number }) => {
    const formattedEndpoint = `${endpoint}?page=${pageParam}${additionalQuery ? "&" + additionalQuery : ""}`;
    const res = await axios.get<Response<T[]>>(formattedEndpoint);
    return res.data;
  };

  const infiniteQuery = useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      const lastPageData = meta?.last_page;
      const currentPage = meta?.current_page ?? 1;
      return lastPageData && lastPageData > currentPage
        ? currentPage + 1
        : null;
    },
    queryFn: fetcher,
    retry: 3,
  });
console.log(infiniteQuery.data)
  const flattedData: T[] = infiniteQuery.data
    ? infiniteQuery.data.pages
        .flatMap((d) => d.data)
        .filter((d) => d !== undefined)
    : [];

  return { flattedData, ...infiniteQuery };
}

function paramBuilder(props: object): string {
  return Object.entries(props)
    .filter(([_, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
}
