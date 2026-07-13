import PostItem from "@/features/posts/components/post-item";
import { API_ROUTES } from "@/constants/api-routes";
import { useUserDataStore } from "@/store/user-data";
import { Response } from "@/types/app";
import { Post } from "@/types/posts";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import PostItemSkeleteon from "@/features/posts/components/post-item-skeleteon";

export default function UserPosts({ username }: { username: string }) {
  const currentUser = useUserDataStore((state) => state.userData);
  const hasHydrated = useUserDataStore((state) => state.hasHydrated);
  const endpoint =
    username === currentUser?.username
      ? API_ROUTES.ME.POSTS
      : API_ROUTES.USERS.POSTS(username);

  const { data, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: () => axios.get<Response<Post[]>>(endpoint),
  });
  const posts = data?.data.data ?? [];

  if (isLoading || hasHydrated === false) {
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
    </section>
  );
}
