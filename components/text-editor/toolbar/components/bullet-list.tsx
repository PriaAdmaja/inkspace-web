import { Editor } from "@tiptap/core";
import ToolbarButton from "./shared/toolbar-button";
import { List } from "lucide-react";
import { useEditorState } from "@tiptap/react";

export default function BulletList({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isBullet: editorInstance?.isActive("bulletList"),
    }),
  });

  const bulletListToggle = () => {
    if (!editor) return;
    editor.chain().focus().toggleBulletList().run();
  };

  return (
    <ToolbarButton
      onClick={bulletListToggle}
      active={editorState?.isBullet}
      toolbarName="Bullet List"
    >
      <List />
    </ToolbarButton>
  );
}
