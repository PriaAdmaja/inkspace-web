import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Ellipsis, FileSliders, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmation from "../../components/delete-confirmation";
import { Post } from "@/types/posts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SettingModal from "./setting-modal";

export default function EditActions({ post }: { post: Post }) {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <Button size={"icon-sm"} variant={"secondary"}>
                  <Ellipsis />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More</TooltipContent>
            </Tooltip>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenDrawer(true)}>
            <FileSliders />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenDeleteConfirmation(true)}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmation
        open={openDeleteConfirmation}
        onOpenChange={setOpenDeleteConfirmation}
        post={post}
      />

      {openDrawer && (
        <SettingModal open={openDrawer} onOpenChange={setOpenDrawer} />
      )}
    </>
  );
}
