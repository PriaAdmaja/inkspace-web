import { Editor } from "@tiptap/core";
import ToolbarButton from "./shared/toolbar-button";
import {  UnderlineIcon } from "lucide-react";
import { useEditorState } from "@tiptap/react";

export default function Underline({ editor }: { editor: Editor | null }) {

  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isUnderline: editorInstance?.isActive("underline"),
    }),
  });

  const underlineToggle = () => {
    if (!editor) return;
    editor.chain().focus().toggleUnderline().run();
  };

  return (
    <ToolbarButton onClick={underlineToggle} active={editorState?.isUnderline}>
      <UnderlineIcon />
    </ToolbarButton>
  );
}
