import { Editor } from "@tiptap/core";
import { AlignJustifyIcon } from "lucide-react";
import { useEditorState } from "@tiptap/react";
import ToolbarButton from "./shared/toolbar-button";

export default function AlignJustify({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isAlignJustify: editorInstance?.isActive({ textAlign: "justify" }),
    }),
  });

  const alignJustifyToggle = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign("justify").run();
  };

  return (
    <ToolbarButton
      onClick={alignJustifyToggle}
      active={editorState?.isAlignJustify}
    >
      <AlignJustifyIcon />
    </ToolbarButton>
  );
}
