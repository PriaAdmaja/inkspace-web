import PostItem from "@/features/posts/components/post-item";
import { API_ROUTES } from "@/constants/api-routes";
import { Post } from "@/types/posts";
import PostItemSkeleteon from "@/features/posts/components/post-item-skeleteon";
import useInfiniteQueryFn from "@/hooks/use-infinite-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function UserPosts({ username }: { username: string }) {
  const endpoint = API_ROUTES.USERS.POSTS(username);

  const {
    flattedData: posts,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQueryFn<Post>({
    endpoint,
    queryKey: [endpoint],
  });

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6">
        {Array.from({ length: 2 }).map((_v, i) => (
          <PostItemSkeleteon key={i} />
        ))}
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return <p className="text-center mt-5">User didn&apos;t post anything</p>;
  }

  return (
    <section className="flex flex-col gap-4">
      {posts.map((post, idx) => (
        <PostItem
          post={post}
          key={post.id}
          showSeparator={idx !== posts.length - 1}
        />
      ))}

      {hasNextPage && (
        <div className="mx-auto mt-2">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage && <Spinner />}
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
