import { Check, ChevronDown, List, ListOrdered } from "lucide-react";
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

export default function ListItemDropdown({ editor }: { editor: Editor | null }) {
const [open, setOpen] = useState<boolean>(false);

  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isBulletList: editorInstance?.isActive("bulletList"),
      isOrderedList: editorInstance?.isActive("orderedList"),
    }),
  });

  const bulletListToggle = () => {
    if (!editor) return;
    editor.chain().focus().toggleBulletList().run();
  };

  const orderedListToggle = () => {
    if (!editor) return;
    editor.chain().focus().toggleOrderedList().run();
  };

  const handleListToggle = (value?: "bulletList" | "orderedList") => {
    switch (value) {
      case "bulletList":
        bulletListToggle();
        break;
      case "orderedList":
        orderedListToggle();
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div>
          <ToolbarButton
            toolbarName="Bullet List"
            className="gap-0"
            active={
              editorState?.isBulletList || editorState?.isOrderedList || open
            }
          >
            {editorState?.isOrderedList ? <ListOrdered /> : <List />}
            <ChevronDown strokeWidth={1.5} />
          </ToolbarButton>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={
              editorState?.isBulletList
                ? "bulletList"
                : editorState?.isOrderedList
                  ? "orderedList"
                  : undefined
            }
            onValueChange={(value) => {
              handleListToggle(value as "bulletList" | "orderedList");
            }}
          >
            <DropdownMenuRadioItem value="orderedList">
              <ListOrdered />
              Ordered List
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bulletList">
              <List />
              Bullet List
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
