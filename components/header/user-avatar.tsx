"use client";
import { UserData, useUserDataStore } from "@/store/user-data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  Palette,
  Settings2,
  SunIcon,
  User,
} from "lucide-react";
import { useAccessTokenStore } from "@/store/access-token";
import { API_ROUTES } from "@/constants/api-routes";
import { AxiosError } from "axios";
import Link from "next/link";
import { routes } from "@/constants/routes";
import { usePathname, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const privateRoutes = ["/new-idea", "/edit"];

export default function UserAvatar({
  user,
  isDisableLogout,
}: {
  user?: UserData | null;
  isDisableLogout?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const setUserData = useUserDataStore((state) => state.setUserData);
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);

  const initialName = user?.username
    ?.split(" ")
    .map((word) => word[0])
    .join("");

  const signOut = async () => {
    try {
      if (privateRoutes.some((route) => pathname.includes(route))) {
        router.replace("/");
      }
      if (isDisableLogout === true) {
        console.log(isDisableLogout);
        return;
      }
      console.log("lolos");
      await axios.post(API_ROUTES.AUTH.LOGOUT, {});
      setAccessToken(null);
      setUserData(null);
    } catch (error) {
      if (error instanceof AxiosError && error.status !== 401) {
        const message = error.message;
        toast.error(message);
      }
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
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <Link href={routes.user.view(user.username)}>
              <DropdownMenuItem>
                <User />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <Link href={routes.me.settings}>
                <Settings2 />
                Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette />
                Theme
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value)}
                  >
                    <DropdownMenuRadioItem value="light">
                      <SunIcon />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <MoonIcon />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <MonitorIcon />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
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
