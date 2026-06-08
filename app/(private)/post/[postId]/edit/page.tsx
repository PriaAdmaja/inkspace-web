import { getPostById } from "@/lib/data/posts";
import EditPost from "@/features/posts/edit-post";

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const postResponse = await getPostById(postId);

  if (!postResponse.data) {
    return null;
  }

  return <EditPost post={postResponse.data} />;
}
