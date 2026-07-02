import { UserAvatar } from "./users";

export type LoginResponse = {
  accessToken: string;
  user: {
    id: string
    username: string;
    name: string;
    email: string;
    avatar?: UserAvatar | null;
    about?: string | null;
  };
};

export type RegisterResponse = LoginResponse;
