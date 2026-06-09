import type { CommandProps } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { UnsplashImageView } from "../custom-node-view/unsplash-image-view";
import { ReactNodeViewRenderer } from "@tiptap/react";

export interface UnsplashImageAttrs {
  src: string;
  thumbnailUrl: string;
  alt?: string;
  photographerName?: string;
  photographerUrl?: string;
  unsplashUrl?: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    unsplashImage: {
      insertUnsplashImage: (attrs: UnsplashImageAttrs) => ReturnType;
    };
  }
}

export const UnsplashImage = Image.extend({
  name: "unsplashImage",
  addAttributes() {
    return {
      ...this.parent?.(),

      thumbnailUrl: {
        default: null,
      },

      photographerName: {
        default: null,
      },

      photographerUrl: {
        default: null,
      },

      unsplashUrl: {
        default: null,
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),

      insertUnsplashImage:
        (attrs: UnsplashImageAttrs) =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({
            type: "unsplashImage",
            attrs,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(UnsplashImageView);
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      {
        class: "my-6 flex flex-col items-center",
      },
      [
        "img",
        {
          src: HTMLAttributes.src,
          alt: HTMLAttributes.alt,
          class: "object-cover max-w-4/5 max-h-[700px]"
        },
      ],
      [
        "figcaption",
        {
          class: "mt-2 text-xs text-muted-foreground",
        },
        "Photo by ",
        [
          "a",
          {
            href: HTMLAttributes.photographerUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "hover:underline"
          },
          HTMLAttributes.photographerName,
        ],
        " on ",
        [
          "a",
          {
            href: "https://unsplash.com",
            target: "_blank",
            rel: "noopener noreferrer",
            class: "hover:underline"
          },
          "Unsplash",
        ],
      ],
    ];
  },
});
