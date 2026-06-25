"use client";
import PageLayout from "@/components/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_ROUTES } from "@/constants/api-routes";
import useFetcher from "@/hooks/use-fetcher";
import { Response } from "@/types/app";
import { User } from "@/types/users";
import Image from "next/image";
import UserPosts from "./components/user-posts";

const avatarPlaceholder = "/no-profile.jpg";

export default function ViewUser({ username }: { username: string }) {
  // Fetching user data
  const { data: user } = useFetcher<Response<User>>({
    endpoint: API_ROUTES.USERS.DETAIL(username),
  });
  const avatar = user?.data?.avatar ?? avatarPlaceholder;
  const name = user?.data?.name ?? user?.data?.username;
  const about = user?.data?.about;

  return (
    <PageLayout>
      <section className="space-y-6">
        {/** User Profile */}
        <section className="space-y-8">
          <section className="flex gap-10">
            {/** Avatar */}
            <div className="size-32 overflow-hidden rounded-2xl relative shrink-0">
              <Image
                src={avatar}
                alt={user?.data?.username ?? "avatar"}
                fill
                className="object-contain"
              />
            </div>

            <div className=" space-y-4">
              <p className="text-4xl font-extrabold">{name}</p>
              {about && <p>{about}</p>}
            </div>
          </section>
        </section>

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
