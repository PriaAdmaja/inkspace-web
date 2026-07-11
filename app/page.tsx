import PageLayout from "@/components/page-layout";
import PostList from "@/features/posts/post-list";

export default async function Home() {
  return (
    <PageLayout>
      <PostList />
    </PageLayout>
  );
}
