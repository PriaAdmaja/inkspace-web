import { getPostsData } from "@/lib/data/posts";
import PageLayout from "@/components/page-layout";
import PostList from "@/features/posts/post-list";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  const posts = search ? { data: [] } : await getPostsData({}); // if there is search query, data will be fetched in client
  const { data } = posts;

  return (
    <PageLayout>
      <PostList posts={data} search={search}/>
    </PageLayout>
  );
}
