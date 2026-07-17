import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash2 } from "lucide-react";
import DeleteConfirmation from "./delete-confirmation";
import { useState } from "react";
import { Post } from "@/types/posts";

export default function PostOptionsDropdown({ post }: { post: Post }) {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);
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

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setOpenDeleteConfirmation(true)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
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
