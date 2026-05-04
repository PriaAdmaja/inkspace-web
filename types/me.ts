export type UserData = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  about?: string;
};

export type MeResponse = {
  user: UserData;
};
