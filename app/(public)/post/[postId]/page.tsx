import ViewPost from "@/features/posts/view-post";
import { getPostById } from "@/lib/data/posts";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const postResponse = await getPostById(postId);

  if (!postResponse.data || postResponse.data.isPublished === false) {
    redirect('/')
  }

  return <ViewPost post={postResponse.data} />;
}
