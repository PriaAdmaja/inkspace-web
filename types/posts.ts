import { JSONContent } from "@tiptap/core";

export type Post = {
  id: string;
  title: string;
  content: JSONContent;
  excerp: string;
  isPublished: boolean
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
  tags: {
    name: string;
    slug: string;
  }[];
};
