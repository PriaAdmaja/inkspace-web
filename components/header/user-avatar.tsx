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

export default function UserAvatar({ user }: { user?: UserData | null }) {
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
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <Link href={routes.user.view(user.username)}>
              <DropdownMenuItem>
                <User />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <Settings2 />
              Settings
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
