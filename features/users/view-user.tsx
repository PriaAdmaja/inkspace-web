"use client";
import PageLayout from "@/components/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserPosts from "./components/user-posts";
import UserProfile from "./components/user-profile";

export default function ViewUser({ username }: { username: string }) {
  return (
    <PageLayout>
      <section className="space-y-6">
        <UserProfile username={username} />

        <Tabs defaultValue="posts">
          <TabsList variant={"line"} className="mb-2">
            <TabsTrigger value="posts" className="text-lg">
              Posts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <UserPosts username={username} />
          </TabsContent>
        </Tabs>
      </section>
    </PageLayout>
  );
}
