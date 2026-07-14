"use client";
import { routes } from "@/constants/routes";
import { Post } from "@/types/posts";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../../../components/ui/separator";

export default function PostItem({
  post,
  showSeparator,
  isMe = false,
}: {
  post: Post;
  showSeparator?: boolean;
  isMe?: boolean;
}) {
  const image = post.content.content?.find((c) => c.type === "unsplashImage");
  const imageThumbnailUrl = image
    ? image.attrs?.thumbnailUrl || image.attrs?.src
    : undefined;

  const openPostLink =
    isMe && post.isPublished === false
      ? routes.post.edit(post.id)
      : routes.post.view(post.id);

  return (
    <section className="space-y-4">
      <div className="flex justify-between">
        <section className="flex flex-col gap-2 w-full pr-4">
          <Link href={openPostLink} className="space-y-2 flex-1 w-full">
            <h2 className="text-xl sm:text-2xl font-bold">{post.title}</h2>
            <p className="text-sm sm:text-base line-clamp-2 sm:line-clamp-4 whitespace-pre-wrap">
              {post.excerp}
            </p>
          </Link>
          <div className="text-muted-foreground text-xs sm:text-sm mt-auto">
            {dayjs(post.createdAt).format("MMM DD, YYYY")} •{" "}
            <Link
              href={routes.user.view(post.author.username)}
              className="hover:underline"
            >
              {post.author.name || post.author.username}
            </Link>
          </div>
        </section>
        {imageThumbnailUrl && (
          <Link
            href={openPostLink}
            className="size-20 sm:size-32 lg:size-40 shrink-0 flex justify-center items-center border relative rounded-sm overflow-hidden"
          >
            <Image
              src={imageThumbnailUrl}
              alt={"image"}
              fill
              className="object-cover"
            />
          </Link>
        )}
      </div>
      {showSeparator && <Separator />}
    </section>
  );
}
