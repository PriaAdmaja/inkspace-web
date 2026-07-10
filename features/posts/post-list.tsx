"use client";
import { Post } from "@/types/posts";
import PostItem from "./components/post-item";
import { API_ROUTES } from "@/constants/api-routes";
import { Response } from "@/types/app";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export default function PostList({
  posts,
  search,
}: {
  posts?: Post[];
  search?: string;
}) {
  const endpoint = `${API_ROUTES.POSTS.GET_ALL}?search=${search}`;
  const { data, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: () => axios.get<Response<Post[]>>(endpoint),
    enabled: !!search,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const returnedData = search ? data?.data.data : posts;

  return (
    <section className="flex flex-col gap-4">
      {returnedData?.map((post: Post, index: number) => {
        return (
          <PostItem
            post={post}
            key={post.id}
            showSeparator={index !== returnedData.length - 1}
          />
        );
      })}
    </section>
  );
}
