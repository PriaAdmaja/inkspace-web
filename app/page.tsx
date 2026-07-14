import PageLayout from "@/components/page-layout";
import PostList from "@/features/posts/post-list";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  
  return (
    <PageLayout>
      <PostList search={search} />
    </PageLayout>
  );
}
