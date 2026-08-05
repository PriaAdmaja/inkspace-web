import { UserMe } from "./me";

export type UserAvatar = {
  small: string;
  medium: string;
  original: string;
};

export type User = Omit<UserMe, "isEmailVerified">;
