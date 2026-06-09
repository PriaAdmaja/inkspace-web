"use client";

import { useEditor, EditorContent, Content } from "@tiptap/react";
import "./styles.css";
import Toolbar from "./toolbar";
import { tiptapExtentions } from "./extentions";

export interface TiptapProps {
  defaultContent?: Content;
  onChange?: (content: object) => void;
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
    extensions: tiptapExtentions({ placeholder, isDisableEnter }),
    content: defaultContent,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(json);
    },
  });

  return (
    <section className="space-y-4 w-full">
      {!disableToolbar && (
        <section className="sticky top-17 pb-1 z-10 bg-white">
          <Toolbar editor={editor} />
        </section>
      )}
      <EditorContent editor={editor} className={className} />
    </section>
  );
};

export default Tiptap;
