"use client";
import { useState } from "react";
import PostEditor from "./post-editor";
import { Post } from "@/types/posts";
import { JSONContent } from "@tiptap/core";
import axios from "@/lib/axios";
import { Response } from "@/types/app";
import { API_ROUTES } from "@/constants/api-routes";
import { toast } from "sonner";

const EditPost = ({ post }: { post: Post }) => {
  const [title, setTitle] = useState<string>(post.title);
  const [content, setContent] = useState<JSONContent>(post.content);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const onSave = async (excerp: string) => {
    try {
      setIsSaveLoading(true);
      await axios.post<Response<Post>>(API_ROUTES.POSTS.UPDATE(post.id), {
        title,
        content: content,
        excerp,
      });
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsSaveLoading(false);
    }
  };

  return (
    <PostEditor
      title={title}
      content={content}
      setTitle={setTitle}
      setContent={setContent}
      isSaveLoading={isSaveLoading}
      onSave={onSave}
    />
  );
};

export default EditPost;
