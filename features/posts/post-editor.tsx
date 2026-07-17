"use client";
import dynamic from "next/dynamic";
import PageLayout from "@/components/page-layout";
import { Separator } from "@/components/ui/separator";
import { generateText, JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { ReactNode } from "react";

const TiptapEditor = dynamic(() => import("@/components/text-editor/tiptap"), {
  ssr: false,
});

export type PostEditorProps = {
  title?: string;
  setTitle?: (title: string) => void;
  content?: JSONContent;
  setContent?: (content: JSONContent, isEmpty?: boolean) => void;
  headerAdditionalComponent?: ReactNode;
};

export default function PostEditor({
  title,
  setTitle,
  content,
  setContent,
  headerAdditionalComponent,
}: PostEditorProps) {
  const saveTitle = (title: object) => {
    const titleText = generateText(title, [StarterKit]);
    setTitle?.(titleText);
  };

  return (
    <PageLayout
      headerAdditionalComponent={
        <div className="flex items-center gap-2 h-full">
          {headerAdditionalComponent}
        </div>
      }
      headerContentClassName="max-w-[1440px] mx-auto"
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
            characterLimit={150}
          />
        </div>
        <Separator />
        <TiptapEditor
          defaultContent={content}
          onChange={setContent}
          className="[&_.ProseMirror]:min-h-[calc(100vh-260px)]"
        />
      </section>
    </PageLayout>
  );
}
