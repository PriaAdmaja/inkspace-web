import { API_ROUTES } from "@/constants/api-routes";
import buildParams from "../param-builder";
import { Response } from "@/types/app";
import { Post } from "@/types/posts";

export async function getPostsData({
  search,
  page,
  limit,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const params = buildParams({ search, page, limit });
  const baseApi = process.env.NEXT_PUBLIC_BASE_API;
  const baseUrl = baseApi?.startsWith("http")
    ? baseApi
    : `https://${baseApi}`;
    const url = `${baseUrl}${API_ROUTES.POSTS.GET_ALL}?${params}`
  const res = await fetch(url);
  return res.json() as Promise<Response<Post[]>>;
}
