import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, FilePen, Send, Trash2 } from "lucide-react";
import DeleteConfirmation from "./delete-confirmation";
import { useState } from "react";
import { Post } from "@/types/posts";
import Link from "next/link";
import { routes } from "@/constants/routes";
import errorMessageBuilder from "@/lib/error-message-builder";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import axios from "@/lib/axios";
import { API_ROUTES } from "@/constants/api-routes";
import { useQueryClient } from "@tanstack/react-query";

export default function PostOptionsDropdown({ post }: { post: Post }) {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);
  const [onPublishLoading, setOnPublishLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const onPublish = async () => {
    try {
      setOnPublishLoading(true);
      await axios.patch(API_ROUTES.POSTS.PUBLISH(post.id), {});
      await queryClient.invalidateQueries({
        queryKey: [API_ROUTES.ME.POSTS],
      });
    } catch (error) {
      const message = errorMessageBuilder(error);
      toast.error(message);
    } finally {
      setOnPublishLoading(false);
    }
  };
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
            {post.isPublished && (
              <DropdownMenuItem asChild>
                <Link href={routes.post.edit(post.id)}>
                  <FilePen />
                  Edit
                </Link>
              </DropdownMenuItem>
            )}
            {post.isPublished === false && (
              <DropdownMenuItem onClick={onPublish} disabled={onPublishLoading}>
                {onPublishLoading ? <Spinner /> : <Send />}
                Publish
              </DropdownMenuItem>
            )}

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
