import { create } from "zustand";

type SearchState = {
  search: string;
  setSearch: (token: string) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  search: "",
  setSearch: (input) => set({ search: input }),
}));
