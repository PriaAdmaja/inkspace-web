'use client'
import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export default function UserAvatar({ user }: { user?: User }) {
    const initialName = user?.name?.split(" ").map((word) => word[0]).join("")
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="cursor-pointer">
                        {!!user?.image && <AvatarImage src={user?.image} alt={user?.name || ""} />}
                        <AvatarFallback>{initialName}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}