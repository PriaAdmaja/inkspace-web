import { LoginResponse } from "@/types/auth";
import { create } from "zustand";

export type UserData = LoginResponse["user"];

type UserDataState = {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
};

export const useUserDataStore = create<UserDataState>((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
}));
