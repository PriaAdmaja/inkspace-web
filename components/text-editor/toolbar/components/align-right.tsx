import { Editor } from "@tiptap/core";
import { AlignRightIcon } from "lucide-react";
import { useEditorState } from "@tiptap/react";
import ToolbarButton from "./shared/toolbar-button";

export default function AlignRight({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isAlignRight: editorInstance?.isActive({ textAlign: "right" }),
    }),
  });

  const alignRightToggle = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign("right").run();
  };

  return (
    <ToolbarButton
      onClick={alignRightToggle}
      active={editorState?.isAlignRight}
      toolbarName="Align Right"
    >
      <AlignRightIcon />
    </ToolbarButton>
  );
}
