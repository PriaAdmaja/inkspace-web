'use client'
import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";

export default function UserAvatar({ user }: { user?: User }) {
    const initialName = user?.name?.split(" ").map((word) => word[0]).join("")
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    {!!user?.image && <AvatarImage src={user?.image} alt={user?.name || ""} />}
                    <AvatarFallback>{initialName}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        My Account
                    </DropdownMenuLabel>
                    <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                        <LogOutIcon />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}