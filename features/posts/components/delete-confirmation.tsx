import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_ROUTES } from "@/constants/api-routes";
import axios from "@/lib/axios";
import { Post } from "@/types/posts";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteConfirmation({
  open,
  onOpenChange,
  post,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
}) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const onDeleting = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(API_ROUTES.POSTS.DELETE(post.id));
      queryClient.invalidateQueries({
        queryKey: [API_ROUTES.ME.POSTS],
      });
      onOpenChange(false);
    } catch (error) {
      const message =
        (error as Error).message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (isDeleting) {
          return;
        }
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>

        <p>
          This action cannot be undone. It will permanently delete this post.
        </p>

        <DialogFooter>
          {isDeleting === false && (
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
          )}
          <Button
            variant={"destructive"}
            disabled={isDeleting}
            onClick={onDeleting}
          >
            <Trash2 /> {isDeleting ? "Deleting" : "Delete Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
