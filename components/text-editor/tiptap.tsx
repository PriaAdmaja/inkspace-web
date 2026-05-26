"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder, CharacterCount } from "@tiptap/extensions";
import { DisableEnter } from "./extentions/disable-enter";
import "./styles.css";
import { Button } from "../ui/button";
import { BoldIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TiptapProps {
  defaultContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  isDisableEnter?: boolean;
  disableToolbar?: boolean;
}

const Tiptap = ({
  defaultContent,
  onChange,
  placeholder,
  className,
  isDisableEnter = false,
  disableToolbar = false,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
      ...(isDisableEnter ? [DisableEnter] : []),
      CharacterCount.configure({
        limit: 2000,
      }),
    ],
    content: defaultContent,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(JSON.stringify(json));
    },
  });

  return (
    <section className="space-y-4 w-full">
      {!disableToolbar && (
        <section className="sticky top-17 pb-1 z-10 bg-white">
          <section className="flex flex-col gap-0.5 px-2 py-1 bg-zinc-200  rounded">
            <Button size={"icon"} variant={"ghost"}>
              <BoldIcon />
            </Button>
          </section>
        </section>
      )}
      <EditorContent editor={editor} className={className} />
    </section>
  );
};

export default Tiptap;
