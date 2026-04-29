"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { DisableEnter } from "./extentions/disable-enter";
import "./styles.css";

export interface TiptapProps {
  defaultContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  isDisableEnter?: boolean;
}

const Tiptap = ({
  defaultContent,
  onChange,
  placeholder,
  className,
  isDisableEnter = false,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
      ...(isDisableEnter ? [DisableEnter] : []),
    ],
    content: defaultContent,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(JSON.stringify(json));
    },
  });

  return <EditorContent editor={editor} className={className || ""} />;
};

export default Tiptap;
