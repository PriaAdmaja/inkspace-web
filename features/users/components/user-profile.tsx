import { API_ROUTES } from "@/constants/api-routes";
import useFetcher from "@/hooks/use-fetcher";
import { useUserDataStore } from "@/store/user-data";
import { Response } from "@/types/app";
import { User } from "@/types/users";
import Image from "next/image";
import EditProfile from "./edit-profile";

const avatarPlaceholder = "/no-profile.jpg";

export default function UserProfile({ username }: { username: string }) {
  const userData = useUserDataStore((state) => state.userData);

  const isMe = userData?.username === username;

  const { data, isLoading } = useFetcher<Response<User>>({
    endpoint: API_ROUTES.USERS.DETAIL(username),
    enable: !isMe,
  });

  const user = isMe ? userData : data?.data;
  const avatar = user?.avatar?.medium ?? avatarPlaceholder;

  const isShowEditButton = isMe && isLoading === false;

  return (
    <section className="space-y-4">
      <section className="flex gap-4 md:gap-10 items-center md:items-start">
        
        {/** Avatar */}
        <img
          src={avatar}
          alt={user?.username ?? "avatar"}
          className="object-cover size-14 sm:size-20 md:size-32 overflow-hidden rounded-2xl shrink-0"
        />

        <div className="md:space-y-4">
          <div className="flex items-center gap-5">
            <p className="text-lg sm:text-2xl md:text-4xl font-extrabold">
              {user?.name ?? user?.username}
            </p>
            {isShowEditButton && <EditProfile user={user} />}
          </div>
          {user?.about && <p className="hidden md:block">{user.about}</p>}
        </div>
      </section>

      {user?.about && <p className="block md:hidden text-sm">{user.about}</p>}
    </section>
  );
}
