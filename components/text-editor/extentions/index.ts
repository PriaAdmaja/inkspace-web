import { CharacterCount, Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import { DisableEnter } from "./disable-enter";
import TextAlign from "@tiptap/extension-text-align";
import { BackgroundColor, TextStyle } from "@tiptap/extension-text-style";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import Blockquote from "@tiptap/extension-blockquote";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Link from "@tiptap/extension-link";
import { UnsplashImage } from "./unsplash-image";
import Heading from "@tiptap/extension-heading";
import { Extensions } from "@tiptap/core";

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all);

type TiptapExtentionsProps = {
  placeholder?: string;
  isDisableEnter?: boolean;
};

export const tiptapExtentions = ({
  placeholder,
  isDisableEnter,
}: TiptapExtentionsProps = {}): Extensions => [
  StarterKit,
  Placeholder.configure({
    placeholder: placeholder || "Start writing...",
  }),
  ...(isDisableEnter ? [DisableEnter] : []),
  TextAlign.configure({
    types: ["paragraph", "heading"],
  }),
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
  Heading.configure({
    levels: [1, 2, 3, 4],
  }),
  CharacterCount.configure({
    limit: 2000,
  }),
];
