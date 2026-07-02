export type UserAvatar = {
  small: string;
  medium: string;
  original: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  about?: string | null;
  avatar?: UserAvatar | null;
};
