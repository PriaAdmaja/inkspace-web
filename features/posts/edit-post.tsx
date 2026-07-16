"use client";
import { useEffect, useState } from "react";
import PostEditor from "./post-editor";
import { Post } from "@/types/posts";
import { JSONContent } from "@tiptap/core";
import axios from "@/lib/axios";
import { Response } from "@/types/app";
import { API_ROUTES } from "@/constants/api-routes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MoveLeft, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import PostSkeleton from "./components/post-skeleton";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { useNavigationGuard } from "next-navigation-guard";
import { excerptBuilder } from "./libs/excerpt-builder";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePostDataTempStore } from "@/store/post-data-temp";

const EditPostComponent = ({ id, post }: { id: string; post: Post }) => {
  // States
  const [title, setTitle] = useState<string>(post.title ?? "");
  const [content, setContent] = useState<JSONContent>(post.content ?? {});
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const setPostTemp = usePostDataTempStore((state) => state.setPost);

  const router = useRouter();
  const { sm } = useMediaQueries();
  const queryClient = useQueryClient();

  // Vars
  const isDraft = post.isPublished === false;

  const onSave = async (excerpt: string, isPublished?: boolean) => {
    try {
      setIsSaveLoading(true);

      const res = await axios.put<Response<Post>>(
        API_ROUTES.POSTS.UPDATE(post.id),
        {
          title,
          content: content,
          excerpt,
          isPublished,
        },
      );
      const newPostData = res.data.data;
      setPostTemp(newPostData ?? null);
      queryClient.invalidateQueries({
        queryKey: [API_ROUTES.POSTS.GET_BY_ID(id)],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ROUTES.ME.POSTS],
      });
      toast.success("Saved!");
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsSaveLoading(false);
    }
  };

  // Guard for unsaved form
  const isFormChanged = post?.title !== title || post.content !== content;
  useNavigationGuard({
    enabled: isFormChanged,
    confirm: () =>
      window.confirm("You have unsaved changes that will be lost."),
  });

  return (
    <PostEditor
      title={title}
      content={content}
      setTitle={setTitle}
      setContent={setContent}
      headerAdditionalComponent={
        <>
          {isDraft ? (
            <Button
              onClick={() => {
                const excerpt = excerptBuilder(content);
                onSave(excerpt);
              }}
              variant={"secondary"}
              disabled={isSaveLoading}
              size={sm ? "sm" : "icon-sm"}
            >
              {isSaveLoading ? <Spinner data-icon="inline-start" /> : <Save />}
              {sm && <> Save as Draft</>}
            </Button>
          ) : (
            <Button
              onClick={() => {
                router.push(routes.post.view(id));
              }}
              variant={"ghost"}
              size={sm ? "sm" : "icon-sm"}
            >
              <MoveLeft />
              {sm && <>Back to View</>}
            </Button>
          )}

          <Button
            variant={"default"}
            disabled={isSaveLoading}
            onClick={() => {
              const excerpt = excerptBuilder(content);
              onSave(excerpt, true);
            }}
            size={sm ? "sm" : "icon-sm"}
          >
            {isSaveLoading ? <Spinner data-icon="inline-start" /> : <Send />}
            {sm && <>Save & Publish</>}
          </Button>
        </>
      }
    />
  );
};

const EditPost = ({ id }: { id: string }) => {
  const postTemp = usePostDataTempStore((state) => state.post);
  const setPostTemp = usePostDataTempStore((state) => state.setPost);

  const isShouldFetchNewData = id !== postTemp?.id;

  // Fetching Data
  const endpoint = API_ROUTES.POSTS.GET_BY_ID(id);
  const { data, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: () => axios.get<Response<Post>>(endpoint),
    enabled: isShouldFetchNewData,
  });
  const post = data?.data.data;

  const returnedPostData = isShouldFetchNewData ? post : postTemp;

  useEffect(() => {
    if (postTemp && isShouldFetchNewData) {
      setPostTemp(null);
    }
  }, [isShouldFetchNewData, postTemp, setPostTemp]);

  if (isLoading || !returnedPostData) {
    return <PostSkeleton />;
  }

  return <EditPostComponent id={id} post={returnedPostData} />;
};

export default EditPost;
