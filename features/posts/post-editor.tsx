"use client";
import dynamic from "next/dynamic";
import { Save, Send } from "lucide-react";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { generateText, JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { tiptapExtentions } from "@/components/text-editor/extentions";

const TiptapEditor = dynamic(() => import("@/components/text-editor/tiptap"), {
  ssr: false,
});

export type PostEditorProps = {
  title?: string;
  setTitle?: (title: string) => void;
  content?: JSONContent;
  setContent?: (content: JSONContent, isEmpty?: boolean) => void;
  isSaveLoading?: boolean;
  isPublishLoading?: boolean;
  isDisableSave?: boolean;
  isDisablePublish?: boolean;
  onSave?: (excerp: string) => void;
  onPublish?: (excerp: string) => void;
};

export default function PostEditor({
  title,
  setTitle,
  content,
  setContent,
  isPublishLoading = false,
  isSaveLoading = false,
  onSave,
  onPublish,
  isDisablePublish = false,
  isDisableSave = false,
}: PostEditorProps) {
  const saveTitle = (title: object) => {
    const titleText = generateText(title, [StarterKit]);
    setTitle?.(titleText);
  };

  return (
    <PageLayout
      headerComponent={
        <div className="flex items-center gap-2 h-full">
          <Button
            onClick={() => {
              const excerp = content
                ? generateText(content, tiptapExtentions())
                : "";
              onSave?.(excerp);
            }}
            variant={"secondary"}
            disabled={isDisableSave || isSaveLoading}
          >
            {isSaveLoading ? <Spinner data-icon="inline-start" /> : <Save />}
            Save as Draft
          </Button>
          <Button
            variant={"default"}
            disabled={isDisablePublish || isPublishLoading}
            onClick={() => {
              const excerp = content
                ? generateText(content, tiptapExtentions())
                : "";
              onPublish?.(excerp);
            }}
          >
            {isPublishLoading ? <Spinner data-icon="inline-start" /> : <Send />}
            Save & Publish
          </Button>
          <Separator orientation="vertical" />
        </div>
      }
    >
      <section className="flex flex-col gap-2">
        <div className="flex w-full">
          <TiptapEditor
            placeholder="Title"
            defaultContent={title}
            className="font-bold text-2xl w-full"
            isDisableEnter
            onChange={saveTitle}
            disableToolbar
          />
        </div>
        <Separator />
        <TiptapEditor defaultContent={content} onChange={setContent} />
      </section>
    </PageLayout>
  );
}
