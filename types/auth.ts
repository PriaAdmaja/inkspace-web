import { UserMe } from "./me";

export type LoginResponse = {
  accessToken: string;
  user: UserMe;
};

export type RegisterResponse = LoginResponse;
