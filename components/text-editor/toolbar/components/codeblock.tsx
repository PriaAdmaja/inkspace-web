import { CodeXml } from "lucide-react";
import ToolbarButton from "./shared/toolbar-button";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";

export default function Codeblock({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isCodeblock: editorInstance?.isActive("codeBlock"),
    }),
  });

  const codeblockToggle = () => {
    if (!editor) return;
    editor.chain().focus().toggleCodeBlock().run();
  };
  return (
    <ToolbarButton
      toolbarName="Codeblock"
      onClick={codeblockToggle}
      active={editorState?.isCodeblock}
    >
      <CodeXml />
    </ToolbarButton>
  );
}
