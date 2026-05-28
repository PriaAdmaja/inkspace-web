import { Editor } from "@tiptap/core";
import ToolbarButton from "./shared/toolbar-button";
import { BoldIcon, StrikethroughIcon } from "lucide-react";
import { useEditorState } from "@tiptap/react";

export default function Strike({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isStrike: editorInstance?.isActive("strike"),
    }),
  });

  const strikeToggle = () => {
    if (!editor) return;
    editor.chain().focus().toggleStrike().run();
  };

  return (
    <ToolbarButton
      onClick={strikeToggle}
      active={editorState?.isStrike}
      toolbarName="Strike"
    >
      <StrikethroughIcon />
    </ToolbarButton>
  );
}
