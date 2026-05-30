import { Editor } from "@tiptap/core";
import ToolbarButton from "./shared/toolbar-button";
import { ListOrdered } from "lucide-react";
import { useEditorState } from "@tiptap/react";

export default function OrderedList({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isOrdered: editorInstance?.isActive("orderedList"),
    }),
  });

  const orderedListToggle = () => {
    if (!editor) return;
    editor.chain().focus().toggleOrderedList().run();
  };

  return (
    <ToolbarButton
      onClick={orderedListToggle}
      active={editorState?.isOrdered}
      toolbarName="Ordered List"
    >
      <ListOrdered />
    </ToolbarButton>
  );
}
