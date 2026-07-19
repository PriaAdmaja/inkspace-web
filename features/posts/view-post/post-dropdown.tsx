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
import { Ellipsis, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import DeleteConfirmation from "../components/delete-confirmation";
import { useState } from "react";

export default function PostDropdown({ post }: { post: Post }) {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);

  const userData = useUserDataStore((state) => state.userData);
  const isAuthor = post.author.username === userData?.username;

  /** Adjust if there is another  */
  if (!isAuthor) {
    return null;
  }

  return (
    <>
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

              <DropdownMenuItem variant="destructive" onClick={() => setOpenDeleteConfirmation(true)}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmation
        open={openDeleteConfirmation}
        onOpenChange={setOpenDeleteConfirmation}
        post={post}
      />
    </>
  );
}
