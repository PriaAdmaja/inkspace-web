"use client";
import { API_ROUTES } from "@/constants/api-routes";
import { routes } from "@/constants/routes";
import axios from "@/lib/axios";
import { Response } from "@/types/app";
import { Post } from "@/types/posts";
import PostEditor from "@/features/posts/post-editor";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { JSONContent } from "@tiptap/core";

export default function NewIdea() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const isDisable = !title.trim() || content === undefined;

  const onSave = async (excerp: string) => {
    try {
      setIsLoading(true);
      if (!content) {
        return;
      }

      const response = await axios.post<Response<Post>>(
        API_ROUTES.POSTS.CREATE,
        {
          title,
          content,
          excerp,
        },
      );
      const id = response.data.data?.id;
      if (id) {
        router.replace(routes.post.edit(id));
      }
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostEditor
      onSave={onSave}
      content={content}
      isDisableSave={isDisable}
      setContent={setContent}
      setTitle={setTitle}
      isSaveLoading={isLoading}
    />
  );
}
