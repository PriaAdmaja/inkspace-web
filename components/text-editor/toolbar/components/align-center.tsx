import { Editor } from "@tiptap/core";
import { AlignCenterIcon } from "lucide-react";
import { useEditorState } from "@tiptap/react";
import ToolbarButton from "./shared/toolbar-button";

export default function AlignCenter({ editor }: { editor: Editor | null }) {

  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isAlignCenter: editorInstance?.isActive({ textAlign: 'center' }),
    }),
  });

  const alignCenterToggle = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign("center").run();
  };

  return (
    <ToolbarButton onClick={alignCenterToggle} active={editorState?.isAlignCenter}>
      <AlignCenterIcon />
    </ToolbarButton>
  );
}
