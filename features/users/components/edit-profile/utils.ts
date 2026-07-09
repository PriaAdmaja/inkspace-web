import { User } from "@/types/users";

export const isFormChanged = ({
  user,
  name,
  about,
  avatar,
}: {
  user?: User;
  name: string;
  about: string;
  avatar?: File | null;
}) => {
  if (user?.name !== name) return true;
  if (user?.about !== about) return true;
  if (avatar !== undefined) return true;
  return false;
};
