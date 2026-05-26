import { Editor } from "@tiptap/core";
import ToolbarButton from "./shared/toolbar-button";
import { BoldIcon } from "lucide-react";
import { useEditorState } from "@tiptap/react";

export default function Bold({ editor }: { editor: Editor | null }) {

  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isBold: editorInstance?.isActive("bold"),
    }),
  });

  const boldToggle = () => {
    if (!editor) return;
    editor.chain().focus().toggleBold().run();
  };

  return (
    <ToolbarButton onClick={boldToggle} active={editorState?.isBold}>
      <BoldIcon />
    </ToolbarButton>
  );
}
