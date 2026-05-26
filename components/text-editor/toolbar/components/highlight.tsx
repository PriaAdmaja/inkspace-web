import { Editor } from "@tiptap/core";
import ToolbarButton from "./shared/toolbar-button";
import { Ban, HighlighterIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEditorState } from "@tiptap/react";
import Separator from "./shared/separator";

const colorList = [
  { color: "#DEFCE8", border: "#B7EBCB" },
  { color: "#E2F3FE", border: "#BDDDEE" },
  { color: "#FFE5E7", border: "#F0C7CC" },
  { color: "#F4E9FF", border: "#DCC8F3" },
  { color: "#FEF9C6", border: "#E8E09A" },
];

export default function Highlight({ editor }: { editor: Editor | null }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      highlightColor:
        editorInstance?.isActive("textStyle") &&
        editorInstance?.getAttributes("textStyle").backgroundColor,
    }),
  });

  const setHighlight = (color: string) => {
    if (!editor) return;
    editor.chain().focus().setBackgroundColor(color).run();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <ToolbarButton active={isOpen || !!editorState?.highlightColor}>
          <HighlighterIcon />
        </ToolbarButton>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-2 flex gap-2">
        {colorList.map((color, index) => (
          <ColorButton
            key={index}
            color={color.color}
            border={color.border}
            onClick={() => setHighlight(color.color)}
            isActive={editorState?.highlightColor === color.color}
          />
        ))}

        <Separator />

        <Button
          size={"icon-sm"}
          variant={"ghost"}
          onClick={() => editor?.chain().focus().unsetBackgroundColor().run()}
        >
          <Ban />
        </Button>
      </PopoverContent>
    </Popover>
  );
}

const ColorButton = ({
  color,
  border,
  onClick,
  isActive = false,
}: {
  color: string;
  border: string;
  onClick: () => void;
  isActive?: boolean;
}) => {
  return (
    <Button
      size={"icon-sm"}
      variant={isActive ? "secondary" : "ghost"}
      onClick={onClick}
    >
      <div
        style={{ backgroundColor: color, border: `1px solid ${border}` }}
        className="w-5 h-5 rounded-full"
      ></div>
    </Button>
  );
};
