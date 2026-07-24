"use client";
import PageLayout from "@/components/page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from "@/types/posts";
import { CircleUser } from "lucide-react";
import { renderToHTMLString } from "@tiptap/static-renderer";
import { tiptapExtentions } from "@/components/text-editor/extentions";
import { Separator } from "@/components/ui/separator";
import PostDropdown from "./post-dropdown";
import Link from "next/link";
import { routes } from "@/constants/routes";
import { Suspense } from "react";
import "@/components/text-editor/styles.css";
import { Badge } from "@/components/ui/badge";
import DateDisplay from "../components/date-display";

export default function ViewPost({ post }: { post: Post }) {
  const author = post.author;
  const html = renderToHTMLString({
    content: post.content,
    extensions: tiptapExtentions(),
  });
  const tags = post.tags.map((t) => t.name);

  return (
    <PageLayout>
      <section className="space-y-4">
        {/** Title */}
        <h2 className="font-bold text-3xl">{post.title}</h2>
        {/** Post details*/}
        <section className="flex items-center gap-4 flex-wrap">
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

            <p className="hover:underline">{author.name || author.username}</p>
          </Link>

          {post.publishedAt && (
            <div className="text-muted-foreground text-sm">
              <DateDisplay date={post.publishedAt} />
            </div>
          )}

          <Suspense>
            <div className="ml-auto">
              <PostDropdown post={post} />
            </div>
          </Suspense>
        </section>

        <Separator />

        {/** Content */}
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="post-content"
        />

        {/** Tags */}
        {tags.length > 0 && (
          <>
            <Separator />

            <div className="space-y-1">
              <p>Tags:</p>
              <div className="flex gap-2 flex-wrap">
                {tags.map((t, i) => (
                  <Badge key={i}>{t}</Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </PageLayout>
  );
}
