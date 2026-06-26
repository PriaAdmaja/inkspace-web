"use client";
import PageLayout from "@/components/page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from "@/types/posts";
import { CircleUser } from "lucide-react";
import { renderToHTMLString } from "@tiptap/static-renderer";
import { tiptapExtentions } from "@/components/text-editor/extentions";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import PostDropdown from "./post-dropdown";
import Link from "next/link";
import { routes } from "@/constants/routes";

export default function ViewPost({ post }: { post: Post }) {
  const author = post.author;
  const html = renderToHTMLString({
    content: post.content,
    extensions: tiptapExtentions(),
  });

  return (
    <PageLayout>
      <section className="space-y-5">
        {/** Title */}
        <h2 className="font-bold text-3xl">{post.title}</h2>

        {/** Post details*/}
        <section className="flex items-center gap-4">
          <Link
            href={routes.user.view(author.username)}
            className="flex items-center gap-2"
          >
            <Avatar className="cursor-pointer">
              {!!author.avatar && (
                <AvatarImage src={author.avatar} alt={author.username || ""} />
              )}
              <AvatarFallback>
                <CircleUser className="w-10/12 h-10/12" strokeWidth={1.5} />
              </AvatarFallback>
            </Avatar>

            <p className="hover:underline">{author.username}</p>
          </Link>
          <p className="text-muted-foreground text-sm">
            {dayjs(post.createdAt).format("MMM DD, YYYY")}
          </p>

          <div className="ml-auto">
            <PostDropdown post={post} />
          </div>
        </section>

        <Separator />

        {/** Content */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </section>
    </PageLayout>
  );
}
