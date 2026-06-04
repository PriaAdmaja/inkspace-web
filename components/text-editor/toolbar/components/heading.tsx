import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
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

type Level = 1 | 2 | 3 | 4;

export default function HeadingDropdown({ editor }: { editor: Editor | null }) {
  const [open, setOpen] = useState<boolean>(false);

  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isHeading1: editorInstance?.isActive("heading", { level: 1 }),
      isHeading2: editorInstance?.isActive("heading", { level: 2 }),
      isHeading3: editorInstance?.isActive("heading", { level: 3 }),
      isHeading4: editorInstance?.isActive("heading", { level: 4 }),
    }),
  });

  const headingToggle = (headingLevel: Level) => {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level: headingLevel }).run();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div>
          <ToolbarButton
            toolbarName="Heading"
            className="gap-0"
            active={
              Object.values(editorState || {}).some(
                (value) => value === true,
              ) || open
            }
          >
            {Object.values(editorState || {}).every(
              (value) => value !== true,
            ) && <Heading />}
            {editorState?.isHeading1 && <Heading1 />}
            {editorState?.isHeading2 && <Heading2 />}
            {editorState?.isHeading3 && <Heading3 />}
            {editorState?.isHeading4 && <Heading4 />}

            <ChevronDown strokeWidth={1.5} />
          </ToolbarButton>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={
              editorState?.isHeading1
                ? "h1"
                : editorState?.isHeading2
                  ? "h2"
                  : editorState?.isHeading3
                    ? "h3"
                    : editorState?.isHeading4
                      ? "h4"
                      : undefined
            }
            onValueChange={(value) => {
              switch (value) {
                case "h1":
                  headingToggle(1);
                  break;
                case "h2":
                  headingToggle(2);
                  break;
                case "h3":
                  headingToggle(3);
                  break;
                case "h4":
                  headingToggle(4);
                  break;
              }
            }}
          >
            <DropdownMenuRadioItem value="h1">
              <Heading1 />
              Heading 1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="h2">
              <Heading2 />
              Heading 2
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="h3">
              <Heading3 />
              Heading 3
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="h4">
              <Heading4 />
              Heading 4
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
