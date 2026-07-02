"use client";
import { UserData, useUserDataStore } from "@/store/user-data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { useAccessTokenStore } from "@/store/access-token";
import { API_ROUTES } from "@/constants/api-routes";
import { AxiosError } from "axios";
import Link from "next/link";
import { routes } from "@/constants/routes";
import { usePathname, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "sonner";

const privateRoutes = ["/new-idea", "/edit"];

export default function UserAvatar({ user }: { user?: UserData | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const setUserData = useUserDataStore((state) => state.setUserData);
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);

  const initialName = user?.username
    ?.split(" ")
    .map((word) => word[0])
    .join("");

  const signOut = async () => {
    try {
      await axios.post(API_ROUTES.AUTH.LOGOUT, {});
      if (privateRoutes.some((route) => pathname.includes(route))) {
        router.replace("/");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.status !== 401) {
        const message = error.message;
        toast.error(message);
      }
    } finally {
      setAccessToken(null);
      setUserData(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          {!!user?.avatar && (
            <AvatarImage src={user?.avatar.small} alt={user?.username || ""} />
          )}
          <AvatarFallback>{initialName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      {user && (
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <Link href={routes.user.view(user.username)}>
              <DropdownMenuItem>My Account</DropdownMenuItem>
            </Link>
            <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
              <LogOutIcon />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
