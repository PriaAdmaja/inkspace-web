import ViewPost from "@/features/posts/view-post";
import { getPostById } from "@/lib/data/posts";

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

  return <ViewPost post={postResponse.data} />;
}
