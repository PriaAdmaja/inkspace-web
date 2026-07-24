"use client";
import { routes } from "@/constants/routes";
import { Post } from "@/types/posts";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../../../components/ui/separator";
import PostOptionsDropdown from "./post-options-dropdown";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DateDisplay from "./date-display";

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

  const tags = post.tags.map((t) => t.name);
  const date =
    post.isPublished && post.publishedAt ? post.publishedAt : post.createdAt;

  return (
    <section className="space-y-2 sm:space-y-4">
      <div className="flex flex-col-reverse sm:flex-row gap-2 justify-between">
        <section className="flex flex-col gap-1 sm:gap-2 w-full">
          <Link
            href={openPostLink}
            className="space-y-1 sm:space-y-2 flex-1 w-full"
          >
            <h2 className="text-xl sm:text-2xl font-bold">{post.title}</h2>
            {tags.length > 0 && (
              <div className="flex gap-1 sm:gap-2 flex-wrap px-1">
                {tags.map((t, i) => (
                  <Badge key={i}>{t}</Badge>
                ))}
              </div>
            )}
            <p className="text-sm sm:text-base line-clamp-3 whitespace-pre-wrap">
              {post.excerpt}
            </p>
          </Link>
          <div className="text-muted-foreground text-xs sm:text-sm mt-auto inline-flex items-center gap-1">
            <DateDisplay date={date} />

            {isMe === false ? (
              <>
                <p>•</p>

                <Link
                  href={routes.user.view(post.author.username)}
                  className="hover:underline"
                >
                  {post.author.name || post.author.username}
                </Link>
              </>
            ) : (
              <div className="ml-auto">
                <PostOptionsDropdown post={post} />
              </div>
            )}
          </div>
        </section>
        {imageThumbnailUrl && (
          <Link
            href={openPostLink}
            className="w-full h-32 sm:size-32 lg:size-40 shrink-0 flex justify-center items-center border relative rounded-sm overflow-hidden"
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
