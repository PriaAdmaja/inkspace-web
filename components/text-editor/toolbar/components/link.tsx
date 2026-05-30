import { Editor } from "@tiptap/core";
import ToolbarButton from "./shared/toolbar-button";
import { LinkIcon, X } from "lucide-react";
import { useEditorState } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function Link({ editor }: { editor: Editor | null }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");

  const editorState = useEditorState({
    editor,
    selector: ({ editor: editorInstance }) => ({
      isLink: editorInstance?.isActive("link"),
    }),
  });

  const saveLink = () => {
    if (!editor) return;
    if (url !== "") {
      const formattedUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: formattedUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);

    // When the popover opens, we want to set the URL input to the current link (if any).
    if (open) {
      const currentUrl = editor?.getAttributes("link").href || "";
      setUrl(currentUrl);

      // if close popover and there is a url, save the link
    } else {
      saveLink();
      setUrl("");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div>
          <ToolbarButton
            toolbarName="Link"
            active={editorState?.isLink || isOpen}
          >
            <LinkIcon />
          </ToolbarButton>
        </div>
      </PopoverTrigger>

      <PopoverContent>
        <InputGroup>
          <InputGroupInput
            placeholder="Enter link here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onOpenChange(false);
              }
            }}
          />
          {url !== "" && (
            <InputGroupAddon align={"inline-end"}>
              <InputGroupButton
                onClick={() => {
                  setUrl("");
                }}
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </PopoverContent>
    </Popover>
  );
}
