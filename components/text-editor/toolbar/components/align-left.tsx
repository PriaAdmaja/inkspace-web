import { Editor } from "@tiptap/core";
import { AlignLeftIcon } from "lucide-react";
import { useEditorState } from "@tiptap/react";
import ToolbarButton from "./shared/toolbar-button";

export default function AlignLeft({ editor }: { editor: Editor | null }) {

  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isAlignLeft: editorInstance?.isActive({ textAlign: 'left' }),
    }),
  });

  const alignLeftToggle = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign("left").run();
  };

  return (
    <ToolbarButton onClick={alignLeftToggle} active={editorState?.isAlignLeft}>
      <AlignLeftIcon />
    </ToolbarButton>
  );
}
