import type { CommandProps } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { UnsplashImageView } from "../custom-node-view/unsplash-image-view";
import { ReactNodeViewRenderer } from "@tiptap/react";

export interface UnsplashImageAttrs {
  src: string;
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
            type: 'unsplashImage',
            attrs,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(UnsplashImageView);
  }

});
