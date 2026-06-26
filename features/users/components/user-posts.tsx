import PostItem from "@/features/posts/post-item";
import { API_ROUTES } from "@/constants/api-routes";
import useFetcher from "@/hooks/use-fetcher";
import { useUserDataStore } from "@/store/user-data";
import { Response } from "@/types/app";
import { MePost } from "@/types/posts";

export default function UserPosts({ username }: { username: string }) {
  const currentUser = useUserDataStore((state) => state.userData);
  const hasHydrated = useUserDataStore((state) => state.hasHydrated);
  const endpoint =
    username === currentUser?.username
      ? API_ROUTES.ME.POSTS
      : API_ROUTES.USERS.POSTS(username);

  const { data, isLoading: isLoading } = useFetcher<Response<MePost[]>>({
    endpoint,
    enable: hasHydrated,
  });
  const posts = data?.data ?? [];

  if (isLoading || hasHydrated === false) {
    return <p>Loading...</p>;
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
    </section>
  );
}
