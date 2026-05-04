"use client";
import { UserData, useUserDataStore } from "@/store/user-data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { useAccessTokenStore } from "@/store/access-token";
import useAxios from "@/hooks/use-axios";
import { API_ROUTES } from "@/constants/api-routes";

export default function UserAvatar({ user }: { user?: UserData | null }) {
  const axios = useAxios();

  const setUserData = useUserDataStore((state) => state.setUserData);
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);

  const initialName = user?.username
    ?.split(" ")
    .map((word) => word[0])
    .join("");

  const signOut = async () => {
    await axios.post(API_ROUTES.AUTH.LOGOUT, {}, { withCredentials: true });
    setAccessToken(null);
    setUserData(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          {!!user?.avatar && (
            <AvatarImage src={user?.avatar} alt={user?.username || ""} />
          )}
          <AvatarFallback>{initialName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
            <LogOutIcon />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
