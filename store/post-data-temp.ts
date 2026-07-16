import { Post } from "@/types/posts";
import { create } from "zustand";

type PostDataTempState = {
  post: Post | null;
  setPost: (data: Post | null) => void;
};

export const usePostDataTempStore = create<PostDataTempState>((set) => ({
  post: null,
  setPost: (post) => set({ post }),
}));
