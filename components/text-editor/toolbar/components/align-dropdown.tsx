import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
} from "lucide-react";
import ToolbarButton from "./shared/toolbar-button";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function AlignDropdown({ editor }: { editor: Editor | null }) {
  const [open, setOpen] = useState<boolean>(false);

  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isLeftAligned: editorInstance?.isActive({ textAlign: "left" }),
      isCenterAligned: editorInstance?.isActive({ textAlign: "center" }),
      isRightAligned: editorInstance?.isActive({ textAlign: "right" }),
      isJustified: editorInstance?.isActive({ textAlign: "justify" }),
    }),
  });

  const leftAlign = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign("left").run();
  };

  const centerAlign = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign("center").run();
  };

  const rightAlign = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign("right").run();
  };

  const justifyAlign = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign("justify").run();
  };

  const isAlignLeftIconActive =
    editorState?.isLeftAligned ||
    Object.values(editorState || {}).every((value) => value !== true);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div>
          <ToolbarButton
            toolbarName="Alignment"
            className="gap-0"
            active={
              editorState?.isLeftAligned ||
              editorState?.isCenterAligned ||
              editorState?.isRightAligned ||
              editorState?.isJustified ||
              open
            }
          >
            {isAlignLeftIconActive && <AlignLeft />}
            {editorState?.isCenterAligned && <AlignCenter />}
            {editorState?.isRightAligned && <AlignRight />}
            {editorState?.isJustified && <AlignJustify />}
            <ChevronDown strokeWidth={1.5} />
          </ToolbarButton>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={
              editorState?.isLeftAligned
                ? "left"
                : editorState?.isCenterAligned
                  ? "center"
                  : editorState?.isRightAligned
                    ? "right"
                    : editorState?.isJustified
                      ? "justify"
                      : undefined
            }
            onValueChange={(value) => {
              switch (value) {
                case "left":
                  leftAlign();
                  break;
                case "center":
                  centerAlign();
                  break;
                case "right":
                  rightAlign();
                  break;
                case "justify":
                  justifyAlign();
                  break;
              }
            }}
          >
            <DropdownMenuRadioItem value="left">
              <AlignLeft />
              Align Left
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="center">
              <AlignCenter />
              Align Center
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">
              <AlignRight />
              Align Right
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="justify">
              <AlignJustify />
              Justify
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
