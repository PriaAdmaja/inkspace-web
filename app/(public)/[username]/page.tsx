import ViewUser from "@/features/users/view-user";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return <ViewUser username={username} />;
}
