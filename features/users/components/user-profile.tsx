import { API_ROUTES } from "@/constants/api-routes";
import { useUserDataStore } from "@/store/user-data";
import { Response } from "@/types/app";
import { User } from "@/types/users";
import EditProfile from "./edit-profile";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import UserProfileSkeleton from "./user-profile-skeleton";

const avatarPlaceholder = "/no-profile.jpg";

export default function UserProfile({ username }: { username: string }) {
  const userData = useUserDataStore((state) => state.userData);

  const isMe = userData?.username === username;

  const endpoint = API_ROUTES.USERS.DETAIL(username);
  const { data, isLoading } = useQuery({
    queryFn: () => axios.get<Response<User>>(endpoint),
    queryKey: [endpoint],
    enabled: !isMe,
  });

  const user = isMe ? userData : data?.data.data;
  const avatar = user?.avatar?.medium ?? avatarPlaceholder;

  const isShowEditButton = isMe && isLoading === false;

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  return (
    <section className="space-y-4">
      <section className="flex gap-4 md:gap-10 items-center md:items-start">
        {/** Avatar */}
        <img
          src={avatar}
          alt={user?.username ?? "avatar"}
          className="object-cover size-20 md:size-32 overflow-hidden rounded-2xl shrink-0"
        />

        <div className="md:space-y-4">
          <div className="flex items-start gap-5">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-extrabold">
              {user?.name ?? user?.username}
            </p>
            {isShowEditButton && (
              <div className="hidden sm:block">
                <EditProfile user={user} />
              </div>
            )}
          </div>
          {user?.about && (
            <p className="hidden md:block whitespace-pre-wrap">{user.about}</p>
          )}
        </div>
      </section>

      {user?.about && (
        <p className="block md:hidden text-sm whitespace-pre-wrap">
          {user.about}
        </p>
      )}

      {isShowEditButton && (
        <div className="block sm:hidden">
          <EditProfile user={user} />
        </div>
      )}
    </section>
  );
}
