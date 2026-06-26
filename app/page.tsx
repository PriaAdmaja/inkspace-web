import { getPostsData } from "@/lib/data/posts";
import { Post } from "@/types/posts";
import PageLayout from "@/components/page-layout";
import PostItem from "@/features/posts/post-item";

export default async function Home() {
  const posts = await getPostsData({});
  const { data } = posts;

  return (
    <PageLayout>
      <section className="flex flex-col gap-4">
        {data?.map((post: Post, index: number) => {
          return (
            <PostItem
              post={post}
              key={post.id}
              showSeparator={index !== data.length - 1}
            />
          );
        })}
      </section>
    </PageLayout>
  );
}
