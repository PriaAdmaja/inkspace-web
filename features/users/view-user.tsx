"use client";
import PageLayout from "@/components/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserPosts from "./components/user-posts";
import UserProfile from "./components/user-profile";
import { useUserDataStore } from "@/store/user-data";
import MePost from "./components/me-posts";

export default function ViewUser({ username }: { username: string }) {
  const userData = useUserDataStore((state) => state.userData);
  const hasHydrated = useUserDataStore((state) => state.hasHydrated);

  if (hasHydrated === false) {
    return <p>Loading...</p>;
  }

  const isMe = userData?.username === username;

  return (
    <PageLayout>
      <section className="space-y-6">
        <UserProfile username={username} />

        <Tabs defaultValue="posts">
          <TabsList variant={"line"} className="mb-4">
            <TabsTrigger value="posts" className="text-2xl">
              Posts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            {isMe ? <MePost /> : <UserPosts username={username} />}
          </TabsContent>
        </Tabs>
      </section>
    </PageLayout>
  );
}
