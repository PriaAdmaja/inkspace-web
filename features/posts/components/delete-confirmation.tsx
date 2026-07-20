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
import { routes } from "@/constants/routes";
import axios from "@/lib/axios";
import errorMessageBuilder from "@/lib/error-message-builder";
import { useUserDataStore } from "@/store/user-data";
import { Post } from "@/types/posts";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteConfirmation({
  open,
  onOpenChange,
  post,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
  onSuccess?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useUserDataStore((state) => state.userData);

  const onDeleting = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(API_ROUTES.POSTS.DELETE(post.id));
      queryClient.invalidateQueries({
        queryKey: [API_ROUTES.ME.POSTS],
      });

      onSuccess?.();

      onOpenChange(false);
      if (pathname.includes(post.id) && user?.username) {
        router.push(routes.user.view(user.username));
      }
    } catch (error) {
      const message = errorMessageBuilder(error);
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
