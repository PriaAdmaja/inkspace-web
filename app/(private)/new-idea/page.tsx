"use client";
import { API_ROUTES } from "@/constants/api-routes";
import axios from "@/lib/axios";
import { Response } from "@/types/app";
import { Post } from "@/types/posts";
import PostEditor from "@/features/posts/post-editor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { JSONContent } from "@tiptap/core";
import { useNavigationGuard } from "next-navigation-guard";
import { isContentEmpty } from "@/features/posts/libs/content-checker";
import { routes } from "@/constants/routes";

export default function NewIdea() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newRoute, setNewRoute] = useState<string | null>(null);

  const router = useRouter();

  const contentEmpty = content === undefined || isContentEmpty(content);
  const isDisable = !title.trim() || contentEmpty;

  const onSave = async (excerp: string, isPublished?: boolean) => {
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
          isPublished,
        },
      );

      const id = response.data.data?.id;
      if (id) {
        if (isPublished) {
          setNewRoute(routes.post.view(id));
        } else {
          setNewRoute(routes.post.edit(id));
        }
      }
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Move to new route after save
  useEffect(() => {
    if (newRoute) {
      router.push(newRoute);
    }
  }, [newRoute, router]);

  // Guard for unsaved form
  const isFormFilled = title !== "" || contentEmpty === false;
  useNavigationGuard({
    enabled: newRoute === null && isFormFilled,
    confirm: () =>
      window.confirm("You have unsaved changes that will be lost."),
  });

  return (
    <PostEditor
      onSave={onSave}
      onPublish={(excerp) => onSave(excerp, true)}
      content={content}
      isDisableSave={isDisable}
      isDisablePublish={isDisable}
      setContent={setContent}
      setTitle={setTitle}
      isSaveLoading={isLoading}
      isPublishLoading={isLoading}
    />
  );
}
