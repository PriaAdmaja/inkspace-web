import { JSONContent } from "@tiptap/core";

export type Post = {
  id: string;
  title: string;
  content: JSONContent;
  excerpt: string;
  isPublished: boolean
  seoTitle?: string
  seoDescription?: string
  createdAt: string;
  updatedAt: string;
  publishedAt?: string
  author: {
    username: string;
    avatar: string | null;
    name: string | null;
  };
  tags: {
    name: string;
    slug: string;
  }[];
};
