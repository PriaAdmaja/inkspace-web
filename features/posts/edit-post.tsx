"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import PostEditor from "./post-editor";
import { MePost } from "@/types/posts";
import { JSONContent } from "@tiptap/core";
import axios from "@/lib/axios";
import { Response } from "@/types/app";
import { API_ROUTES } from "@/constants/api-routes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MoveLeft, Save, Send } from "lucide-react";
import { excerpBuilder } from "./libs/excerp-builder";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import PostSkeleton from "./components/post-skeleton";
import { useMediaQueries } from "@/hooks/use-media-queries";

const EditPost = ({ id }: { id: string }) => {
  // States
  const [post, setPost] = useState<MePost | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<JSONContent>({});
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isGettingData, setIsGettingData] = useState<boolean>(false);

  const router = useRouter();
  const { sm } = useMediaQueries();

  // Vars
  const isDraft = !post?.isPublished;

  // Fetching Data
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

  const onSave = async (excerp: string, isPublished?: boolean) => {
    try {
      setIsSaveLoading(true);
      if (!post?.id) return;

      await axios.put<Response<MePost>>(API_ROUTES.POSTS.UPDATE(post.id), {
        title,
        content: content,
        excerp,
        isPublished,
      });
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsSaveLoading(false);
    }
  };

  if (isGettingData) {
    return <PostSkeleton />;
  }

  return (
    <PostEditor
      title={title}
      content={content}
      setTitle={setTitle}
      setContent={setContent}
      headerComponent={
        <>
          {isDraft ? (
            <Button
              onClick={() => {
                const excerp = excerpBuilder(content);
                onSave(excerp);
              }}
              variant={"secondary"}
              disabled={isSaveLoading}
              size={"sm"}
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
              size={"sm"}
            >
              <MoveLeft />
              {sm && <>Back to View</>}
            </Button>
          )}

          <Button
            variant={"default"}
            disabled={isSaveLoading}
            onClick={() => {
              const excerp = excerpBuilder(content);
              onSave(excerp, true);
            }}
            size={"sm"}
          >
            {isSaveLoading ? <Spinner data-icon="inline-start" /> : <Send />}
            {sm && <>Save & Publish</>}
          </Button>
        </>
      }
    />
  );
};

export default EditPost;
