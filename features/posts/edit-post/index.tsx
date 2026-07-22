"use client";
import { useEffect, useState } from "react";
import PostEditor from "../post-editor";
import { Post } from "@/types/posts";
import axios from "@/lib/axios";
import { Response } from "@/types/app";
import { API_ROUTES } from "@/constants/api-routes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MoveLeft, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import PostSkeleton from "../components/post-skeleton";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { useNavigationGuard } from "next-navigation-guard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePostDataTempStore } from "@/store/post-data-temp";
import errorMessageBuilder from "@/lib/error-message-builder";
import { deepEqualObject } from "@/lib/deep-equal-object";
import EditActions from "./components/edit-actions-dropdown";
import { finalTagsValue } from "./utils/tag-converter";
import { PostContextProvider, usePostContext } from "./context/post-context";

const EditPostComponent = ({ id, post }: { id: string; post: Post }) => {
  // States
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const {
    title,
    setTitle,
    content,
    setContent,
    excerpt,
    tags: tagsString,
    seoTitle,
    seoDescription,
  } = usePostContext();

  const setPostTemp = usePostDataTempStore((state) => state.setPost);

  const router = useRouter();
  const { sm } = useMediaQueries();
  const queryClient = useQueryClient();

  // Vars
  const isDraft = post.isPublished === false;

  const onSave = async (isPublished?: boolean) => {
    try {
      setIsSaveLoading(true);

      const tags = finalTagsValue(tagsString);

      const res = await axios.put<Response<Post>>(
        API_ROUTES.POSTS.UPDATE(post.id),
        {
          title,
          content,
          excerpt,
          isPublished,
          tags,
          seoTitle,
          seoDescription,
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
      const message = errorMessageBuilder(error);
      toast.error(message);
    } finally {
      setIsSaveLoading(false);
    }
  };

  // Guard for unsaved form
  const originalData = {
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    tags: post.tags.map((t) => t.slug),
  };
  const newData = {
    title,
    content,
    excerpt,
    seoTitle,
    seoDescription,
    tags: finalTagsValue(tagsString),
  };
  const isFormChanged = deepEqualObject(originalData, newData) === false;
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
                onSave();
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
              onSave(true);
            }}
            size={sm ? "sm" : "icon-sm"}
          >
            {isSaveLoading ? <Spinner data-icon="inline-start" /> : <Send />}
            {sm && <>Save & Publish</>}
          </Button>

          <EditActions post={post} />
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

  return (
    <PostContextProvider post={returnedPostData}>
      <EditPostComponent id={id} post={returnedPostData} />
    </PostContextProvider>
  );
};

export default EditPost;
