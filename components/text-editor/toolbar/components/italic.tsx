import { Editor, useEditorState } from "@tiptap/react";
import ToolbarButton from "./shared/toolbar-button";
import { ItalicIcon } from "lucide-react";

export default function Italic({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isItalic: editorInstance?.isActive("italic"),
    }),
  });

  const italicToggle = () => {
    if (!editor) return;
    editor.chain().focus().toggleItalic().run();
  };

  return (
    <ToolbarButton onClick={italicToggle} active={editorState?.isItalic}>
      <ItalicIcon />
    </ToolbarButton>
  );
}
