import { LoginResponse } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserData = LoginResponse["user"];

type UserDataState = {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set) => ({
      userData: null,
      setUserData: (data) => set({ userData: data }),
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "user-data",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
