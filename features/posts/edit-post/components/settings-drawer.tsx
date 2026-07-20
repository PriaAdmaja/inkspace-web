import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { stringToArray } from "../utils/tag-converter";
import { usePostContext } from "../context/post-context";
import { excerptLimit } from "../constant";

export default function SettingsDrawer({
  onOpenChange,
  open,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { tags, setTags, excerpt, setExcerpt } = usePostContext();

  const { md } = useMediaQueries();
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={md ? "right" : "bottom"}
      modal={false}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Post Settings</DrawerTitle>
        </DrawerHeader>

        <FieldGroup className="px-4">
          <Field>
            <FieldLabel>Tags</FieldLabel>
            <Input
              value={tags}
              onChange={(e) => {
                const value = e.target.value;
                const isMaxCount = stringToArray(value).length - 1 === 5; //
                const isTypingComma = value.at(-1) === ",";

                if (isMaxCount && isTypingComma) {
                  setTags(value.slice(0, -1));
                  return;
                }

                setTags(value);
              }}
            />
            <FieldDescription>
              Separate tags with commas (e.g. technology, tutorial,
              productivity). Maximum 5 tags.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Excerpt</FieldLabel>
            <Textarea
              value={excerpt}
              onChange={(e) => {
                const value = e.target.value;
                setExcerpt(value);
              }}
              maxLength={excerptLimit}
            />
            <p className="text-end text-muted-foreground text-xs">{excerpt.length} / {excerptLimit}</p>
            <FieldDescription>
              Write a short summary of your post. This will appear in post
              previews, search results, and other listing pages.
            </FieldDescription>
          </Field>
        </FieldGroup>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
