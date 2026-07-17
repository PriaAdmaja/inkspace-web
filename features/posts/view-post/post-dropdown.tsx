'use client";';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/constants/routes";
import { useUserDataStore } from "@/store/user-data";
import { Post } from "@/types/posts";
import { Ellipsis, SquarePen } from "lucide-react";
import Link from "next/link";

export default function PostDropdown({ post }: { post: Post }) {
  const userData = useUserDataStore((state) => state.userData);
  const isAuthor = post.author.username === userData?.username;

  /** Adjust if there is another  */
  if (!isAuthor) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button size={"icon-sm"} variant={"ghost"}>
            <Ellipsis />
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {isAuthor && (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={routes.post.edit(post.id)}>
                <SquarePen />
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
