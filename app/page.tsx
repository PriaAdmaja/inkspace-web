import { getPostsData } from "@/lib/data/posts";
import { Post } from "@/types/posts";
import dayjs from "dayjs";
import { Separator } from "@/components/ui/separator";
import { ImageOff } from "lucide-react";
import PageLayout from "@/components/page-layout";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/constants/routes";

export default async function Home() {
  const posts = await getPostsData({});
  const { data } = posts;
  console.log(data);
  return (
    <PageLayout>
      <section className="flex flex-col gap-4">
        {data?.map((post: Post, index: number) => {
          const image = post.content.content?.find(
            (c) => c.type === "unsplashImage",
          );
          const imageThumbnailUrl = image
            ? (image.attrs?.thumbnailUrl || image.attrs?.src)
            : undefined;
            console.log(image)
          return (
            <section key={post.id} className="space-y-4">
              <Link href={routes.post.view(post.id)} className="flex gap-4 justify-between cursor-pointer">
                <section className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold">{post.title}</h2>
                  <p className="line-clamp-4">{post.excerp}</p>
                  <div className="text-muted-foreground text-sm mt-auto">
                    {dayjs(post.createdAt).format("MMM DD, YYYY")} •{" "}
                    {post.author.username}
                  </div>
                </section>
                <div className="w-40 h-40 shrink-0 flex justify-center items-center border relative rounded-sm overflow-hidden">
                  {imageThumbnailUrl ? (
                    <Image
                      src={imageThumbnailUrl}
                      alt={"image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageOff className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
              </Link>
              {index !== data.length - 1 && <Separator />}
            </section>
          );
        })}
      </section>
    </PageLayout>
  );
}
