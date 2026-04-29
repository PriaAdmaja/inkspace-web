import { create } from "zustand";

type AccessTokenState = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

export const useAccessTokenStore = create<AccessTokenState>((set) => ({
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),
}));