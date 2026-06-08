import { JSONContent } from "@tiptap/core";

export type Post = {
  id: string;
  title: string;
  content: JSONContent;
  excerp: string
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string | null;
    avatar: string | null;
  };
  tags: {
    name: string;
    slug: string;
  }[];
};
