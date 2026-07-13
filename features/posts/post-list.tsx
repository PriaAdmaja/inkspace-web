"use client";
import { Post } from "@/types/posts";
import PostItem from "./components/post-item";
import { API_ROUTES } from "@/constants/api-routes";
import { useSearchParams } from "next/navigation";
import useInfiniteQueryFn from "@/hooks/use-infinite-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import PostItemSkeleteon from "./components/post-item-skeleteon";

export default function PostList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;

  const {
    isLoading,
    flattedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQueryFn<Post>({
    endpoint: API_ROUTES.POSTS.GET_ALL,
    queryKey: ["postList", search],
    queryParams: {
      search: search,
    },
  });

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6">
        {Array.from({ length: 2 }).map((_value, idx) => (
          <PostItemSkeleteon key={idx} />
        ))}
      </section>
    );
  }

  const returnedData = flattedData;

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

      <div className="mx-auto">
        {hasNextPage && (
          <Button onClick={() => fetchNextPage} disabled={isFetchingNextPage}>
            {isFetchingNextPage && <Spinner />}
            Load more
          </Button>
        )}
      </div>
    </section>
  );
}
