"use client";

import { useEditor, EditorContent, Content } from "@tiptap/react";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import "./styles.css";
import Toolbar from "./toolbar";
import { tiptapExtentions } from "./extentions";

export interface TiptapProps {
  defaultContent?: Content;
  onChange?: (content: object, isEmpty?: boolean) => void;
  placeholder?: string;
  className?: string;
  isDisableEnter?: boolean;
  disableToolbar?: boolean;
  characterLimit?: number;
}

const Tiptap = ({
  defaultContent,
  onChange,
  placeholder,
  className,
  isDisableEnter = false,
  disableToolbar = false,
  characterLimit = 2000,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: tiptapExtentions({
      placeholder,
      isDisableEnter,
      characterLimit,
    }),
    content: defaultContent,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(json, editor.isEmpty);
    },
    editorProps: {
      handleDOMEvents: {
        blur: (view) => {
          const { state } = view;

          // handle selection on unsplash image
          if (state.selection instanceof NodeSelection) {
            view.dispatch(
              state.tr.setSelection(
                TextSelection.create(state.doc, state.selection.from),
              ),
            );
          }

          return false;
        },
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");

        if (text) {
          view.dispatch(
            view.state.tr.insertText(
              text,
              view.state.selection.from,
              view.state.selection.to,
            ),
          );

          return true;
        }

        return false;
      },
    },
  });

  return (
    <section className="space-y-4 w-full">
      {!disableToolbar && (
        <section className="sticky top-17 pb-1 z-10 bg-background -mx-1">
          <Toolbar editor={editor} />
        </section>
      )}
      <EditorContent editor={editor} className={className} />
    </section>
  );
};

export default Tiptap;
