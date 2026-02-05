import Header from "@/components/header/page-header";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getPostsData } from "@/lib/data/posts";
import { Post } from "@/types/posts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";

export default async function Home() {
  const session = await auth()
  const posts = await getPostsData({})
  const { data } = posts
  return (
    <div className="min-h-screen">
      <Suspense>
        <Header user={session?.user} />
      </Suspense>

      <section className="p-10 flex flex-col gap-4">
        {data?.map((post: Post) => {
          const content = post.content.split(" ").slice(0, 70).join(" ")
          return (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
                <CardDescription>by {post.author.username}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{content}{post.content.length > 70 && "..."}</p>
              </CardContent>
              <CardFooter>
                <p className="text-muted-foreground text-sm">{dayjs(post.createdAt).format("MMM DD, YYYY")}</p>
              </CardFooter>
            </Card>
          )
        })}
      </section>
    </div>
  );
}
