import { Post } from "@/types/posts";
import { JSONContent } from "@tiptap/core";
import { createContext, ReactNode, useContext, useState } from "react";
import { arrayToString } from "../utils/tag-converter";

type PostContextType = {
  post: Post | null;
  title: string;
  setTitle: (value: string) => void;
  content: JSONContent;
  setContent: (content: JSONContent) => void;
  tags: string;
  setTags: (tags: string) => void;
  excerpt: string;
  setExcerpt: (excerpt: string) => void;
};

const PostContext = createContext<PostContextType>({
  post: null,
  content: {},
  setContent: () => {},
  title: "",
  setTitle: () => {},
  excerpt: "",
  setExcerpt: () => {},
  tags: "",
  setTags: () => {},
});

export const PostContextProvider = ({
  children,
  post,
}: {
  children: ReactNode;
  post: Post;
}) => {
  const [title, setTitle] = useState<string>(post.title);
  const [content, setContent] = useState<JSONContent>(post.content);
  const [excerpt, setExcerpt] = useState<string>(post.excerpt);
  const [tags, setTags] = useState<string>(() =>
    arrayToString(post.tags.map((t) => t.name)),
  );
  return (
    <PostContext.Provider
      value={{
        post,
        content,
        excerpt,
        setContent,
        setExcerpt,
        setTags,
        setTitle,
        tags,
        title,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context)
    throw new Error("usePostContext must be used within a PostContextProvider");
  return context;
};
