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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Save, Send } from "lucide-react";
import { excerptBuilder } from "@/features/posts/libs/excerpt-builder";
import { usePostDataTempStore } from "@/store/post-data-temp";
import { useMediaQueries } from "@/hooks/use-media-queries";
import {errorMessageBuilder} from "@/lib/error";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PostSettings from "@/features/posts/components/post-settings";
import {
  seoDescriptionBuilder,
  seoTitleBuilder,
} from "@/features/posts/edit-post/utils/seo-content";
import { useUserDataStore } from "@/store/user-data";

export default function NewIdea() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [excerpt, setExcerpt] = useState<string>("");
  const [seoTitle, setSeoTitle] = useState<string>("");
  const [seoDescription, setSeoDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newRoute, setNewRoute] = useState<string | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState<boolean>(false);

  const setPostDataTemp = usePostDataTempStore((state) => state.setPost);
  const userData = useUserDataStore((state) => state.userData);
  const router = useRouter();
  const { sm } = useMediaQueries();

  const contentEmpty = content === undefined || isContentEmpty(content);
  const isDisable = !title.trim() || contentEmpty;

  const onSubmit = async ({
    isPublished,
    submittedSeoTitle,
    submittedSeoDescription,
    submittedExcerpt,
  }: {
    isPublished?: boolean;
    submittedSeoTitle: string;
    submittedSeoDescription: string;
    submittedExcerpt: string;
  }) => {
    if (!content) {
      return;
    }

    const response = await axios.post<Response<Post>>(API_ROUTES.POSTS.CREATE, {
      title,
      content,
      excerpt: submittedExcerpt,
      isPublished,
      seoTitle: submittedSeoTitle,
      seoDescription: submittedSeoDescription,
    });

    const id = response.data.data?.id;
    if (id) {
      if (isPublished) {
        setNewRoute(routes.post.view(id));
      } else {
        setPostDataTemp(response.data.data ?? null);
        setNewRoute(routes.post.edit(id));
      }
    }
  };

  const onSaveDraft = async () => {
    const submittedExcerpt = excerptBuilder(content);
    const submittedSeoDescription = seoDescriptionBuilder(submittedExcerpt);
    const submittedSeoTitle = seoTitleBuilder(title, userData?.name);
    try {
      setIsLoading(true);
      await onSubmit({
        isPublished: false,
        submittedExcerpt,
        submittedSeoDescription,
        submittedSeoTitle,
      });
    } catch (error) {
      const message = errorMessageBuilder(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSavePublish = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        submittedSeoTitle: seoTitle,
        submittedSeoDescription: seoDescription,
        submittedExcerpt: excerpt,
        isPublished: true,
      });
      toast.success("Post is published successfully");
    } catch (error) {
      const message = errorMessageBuilder(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
    <>
      <PostEditor
        content={content}
        setContent={setContent}
        setTitle={setTitle}
        headerAdditionalComponent={
          <>
            <Button
              onClick={() => {
                onSaveDraft();
              }}
              size={sm ? "sm" : "icon-sm"}
              variant={"secondary"}
              disabled={isDisable || isLoading}
            >
              {isLoading ? <Spinner data-icon="inline-start" /> : <Save />}
              {sm && <> Save as Draft</>}
            </Button>
            <Button
              variant={"default"}
              disabled={isDisable || isLoading}
              onClick={() => {
                const generatedExcerpt = excerpt || excerptBuilder(content);

                if (!excerpt) {
                  setExcerpt(generatedExcerpt);
                }

                if (!seoTitle) {
                  const newSeoTitle = seoTitleBuilder(title, userData?.name);
                  setSeoTitle(newSeoTitle);
                }

                if (!seoDescription) {
                  const newSeoDesc = seoDescriptionBuilder(generatedExcerpt);
                  setSeoDescription(newSeoDesc);
                }

                setShowPublishDialog(true);
              }}
              size={sm ? "sm" : "icon-sm"}
            >
              <Send />
              {sm && <>Save & Publish</>}
            </Button>
          </>
        }
      />

      {showPublishDialog && (
        <Dialog
          open={showPublishDialog}
          onOpenChange={(value) => {
            if (isSubmitting) {
              return;
            }
            setShowPublishDialog(value);
          }}
        >
          <DialogContent className="sm:max-w-6xl">
            <DialogHeader>
              <DialogTitle>Publish</DialogTitle>
            </DialogHeader>

            <PostSettings
              title={title}
              content={content ?? {}}
              excerpt={excerpt}
              setExcerpt={setExcerpt}
              seoTitle={seoTitle}
              setSeoTitle={setSeoTitle}
              seoDescription={seoDescription}
              setSeoDescription={setSeoDescription}
              tags={tags}
              setTags={setTags}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"secondary"}>Cancel</Button>
              </DialogClose>
              <Button onClick={onSavePublish} disabled={isSubmitting}>
                {isSubmitting ? <Spinner data-icon="inline-start" /> : <Send />}
                {sm && <>Save & Publish</>}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
