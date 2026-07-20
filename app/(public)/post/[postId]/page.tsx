import ViewPost from "@/features/posts/view-post";
import { getPostById } from "@/lib/data/posts";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ postId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { postId } = await params;
  const postResponse = await getPostById(postId);
  const data = postResponse.data;
  return {
    title: data?.title,
    description: data?.excerpt,
  };
}

export default async function Page({ params }: Props) {
  const { postId } = await params;
  const postResponse = await getPostById(postId);

  if (!postResponse.data || postResponse.data.isPublished === false) {
    redirect("/");
  }

  return <ViewPost post={postResponse.data} />;
}
