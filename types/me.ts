import { UserAvatar } from "./users";

export type UserMe = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: UserAvatar;
  about?: string;
  isEmailVerified?: boolean;
};

export type MeResponse = {
  user: UserMe;
};
