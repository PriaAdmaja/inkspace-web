import EditPost from "@/features/posts/edit-post";

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return <EditPost id={postId} />;
}
