"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import PostEditor from "./post-editor";
import { MePost } from "@/types/posts";
import { JSONContent } from "@tiptap/core";
import axios from "@/lib/axios";
import { Response } from "@/types/app";
import { API_ROUTES } from "@/constants/api-routes";
import { toast } from "sonner";

const EditPost = ({ id }: { id: string }) => {
  const [post, setPost] = useState<MePost | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<JSONContent>({});
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isPublishLoading, setIsPublishLoading] = useState<boolean>(false);
  const [isGettingData, setIsGettingData] = useState<boolean>(false);

  const hasFetched = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      setIsGettingData(true);
      const res = await axios.get<Response<MePost>>(
        API_ROUTES.POSTS.GET_BY_ID(id),
      );
      const postData = res.data.data;
      if (postData) {
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
      }
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsGettingData(false);
    }
  }, [id]);

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    fetchData();
  }, [fetchData]);

  const onSave = async (excerp: string) => {
    try {
      setIsSaveLoading(true);
      if (!post?.id) return;

      await axios.put<Response<MePost>>(API_ROUTES.POSTS.UPDATE(post.id), {
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

  const onPublish = async () => {
    try {
      setIsPublishLoading(true);
      if (!post?.id) return;

      await axios.put<Response<MePost>>(API_ROUTES.POSTS.PUBLISH(post.id), {});
      toast.success("This post is published successfully");
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsPublishLoading(false);
    }
  };

  if (isGettingData) {
    return <p>Loading...</p>;
  }

  return (
    <PostEditor
      title={title}
      content={content}
      setTitle={setTitle}
      setContent={setContent}
      isSaveLoading={isSaveLoading}
      isPublishLoading={isPublishLoading}
      isDisablePublish={post?.isPublished}
      onSave={onSave}
      onPublish={onPublish}
    />
  );
};

export default EditPost;
