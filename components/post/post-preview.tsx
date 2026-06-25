import { routes } from "@/constants/routes";
import { Post } from "@/types/posts";
import dayjs from "dayjs";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";

export default function PostPreview({
  post,
  showSeparator,
}: {
  post: Post;
  showSeparator?: boolean;
}) {

  const image = post.content.content?.find((c) => c.type === "unsplashImage");
  const imageThumbnailUrl = image
    ? image.attrs?.thumbnailUrl || image.attrs?.src
    : undefined;

  return (
    <section className="space-y-4">
      <Link
        href={routes.post.view(post.id)}
        className="flex gap-4 justify-between cursor-pointer"
      >
        <section className="flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">{post.title}</h2>
          <p className="text-sm sm:text-base line-clamp-2 sm:line-clamp-4">{post.excerp}</p>
          <div className="text-muted-foreground text-xs sm:text-sm mt-auto">
            {dayjs(post.createdAt).format("MMM DD, YYYY")} •{" "}
            {post.author.username}
          </div>
        </section>
        <div className="size-20 sm:size-32 lg:size-40 shrink-0 flex justify-center items-center border relative rounded-sm overflow-hidden">
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
      {showSeparator && <Separator />}
    </section>
  );
}
