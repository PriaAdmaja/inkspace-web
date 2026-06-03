"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder, CharacterCount } from "@tiptap/extensions";
import TextAlign from "@tiptap/extension-text-align";
import Text from "@tiptap/extension-text";
import { BackgroundColor, TextStyle } from "@tiptap/extension-text-style";
import { DisableEnter } from "./extentions/disable-enter";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Blockquote from "@tiptap/extension-blockquote";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Link from "@tiptap/extension-link";
import { all, createLowlight } from "lowlight";
import "./styles.css";
import Toolbar from "./toolbar";
import { UnsplashImage } from "./extentions/unsplash-image";

export interface TiptapProps {
  defaultContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  isDisableEnter?: boolean;
  disableToolbar?: boolean;
}

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all);

const Tiptap = ({
  defaultContent,
  onChange,
  placeholder,
  className,
  isDisableEnter = false,
  disableToolbar = false,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
      ...(isDisableEnter ? [DisableEnter] : []),
      TextAlign.configure({
        types: ["paragraph", "heading"],
      }),
      Text,
      TextStyle,
      BackgroundColor,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Blockquote,
      ListItem,
      BulletList,
      OrderedList,
      Link.configure({
        openOnClick: false,
        autolink: false,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme,
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
      }).extend({ inclusive: false }),
      UnsplashImage,
      CharacterCount.configure({
        limit: 2000,
      }),
    ],
    content: defaultContent,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(JSON.stringify(json));
    },
  });

  return (
    <section className="space-y-4 w-full">
      {!disableToolbar && (
        <section className="sticky top-17 pb-1 z-10 bg-white">
          <Toolbar editor={editor} />
        </section>
      )}
      <EditorContent editor={editor} className={className} />
    </section>
  );
};

export default Tiptap;
