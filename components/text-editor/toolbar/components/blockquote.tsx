import { CodeXml, TextQuote } from "lucide-react";
import ToolbarButton from "./shared/toolbar-button";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";

export default function Blockquote({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isBlockquote: editorInstance?.isActive("blockquote"),
    }),
  });

  const blockquoteToggle = () => {
    if (!editor) return;
    editor.chain().focus().toggleBlockquote().run();
  };
  return (
    <ToolbarButton
      toolbarName="Blockquote"
      onClick={blockquoteToggle}
      active={editorState?.isBlockquote}
    >
      <TextQuote />
    </ToolbarButton>
  );
}
