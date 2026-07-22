import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PostSettings from "../../components/post-settings";
import { Button } from "@/components/ui/button";
import { usePostContext } from "../context/post-context";

export default function SettingModal({
  onOpenChange,
  open,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    title,
    content,
    excerpt,
    seoTitle,
    seoDescription,
    tags,
    setExcerpt,
    setSeoTitle,
    setSeoDescription,
    setTags,
  } = usePostContext();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Post Settings</DialogTitle>
        </DialogHeader>

        <PostSettings
          title={title}
          content={content}
          excerpt={excerpt}
          seoTitle={seoTitle}
          seoDescription={seoDescription}
          tags={tags}
          setExcerpt={setExcerpt}
          setSeoTitle={setSeoTitle}
          setSeoDescription={setSeoDescription}
          setTags={setTags}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
