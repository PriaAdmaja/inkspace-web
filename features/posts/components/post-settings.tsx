import { Post } from "@/types/posts";
import PostItem from "./post-item";
import { useUserDataStore } from "@/store/user-data";
import { JSONContent } from "@tiptap/core";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { stringToArray } from "../edit-post/utils/tag-converter";
import { Textarea } from "@/components/ui/textarea";
import { excerptLimit } from "../edit-post/constant";

type PostSettingsProps = {
  title: string;
  content: JSONContent;
  excerpt: string;
  setExcerpt: (excerpt: string) => void;
  seoTitle: string;
  setSeoTitle: (value: string) => void;
  seoDescription: string;
  setSeoDescription: (value: string) => void;
  tags: string;
  setTags: (tags: string) => void;
};

export default function PostSettings({
  content,
  excerpt,
  setExcerpt,
  seoDescription,
  setSeoDescription,
  seoTitle,
  setSeoTitle,
  tags: tagsString,
  setTags,
  title,
}: PostSettingsProps) {
  const { userData } = useUserDataStore();

  const previewData: Post = {
    title,
    content,
    excerpt,
    seoTitle,
    seoDescription,
    tags: tagsString
      ? tagsString
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v !== "")
          .map((t) => ({ name: t, slug: t }))
      : [],
    isPublished: true,
    id: "dummy-id",
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    publishedAt: new Date().toDateString(),
    author: {
      avatar: userData?.avatar?.small ?? null,
      name: userData?.name ?? "",
      username: userData?.username ?? "",
    },
  };

  return (
    <FieldGroup className="overflow-y-auto max-h-[70vh] py-1 md:px-1">
      <FieldSet>
        <FieldLegend>Post Preview</FieldLegend>

        <div className="relative border-t border-b p-1 md:p-2 bg-secondary">
          <PostItem post={previewData} />
          <div className="absolute w-full h-full top-0 left-0 cursor-not-allowed"></div>
        </div>
      </FieldSet>

      <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <FieldLegend>Setting</FieldLegend>
        <FieldGroup className="col-span-1">
          <Field>
            <FieldLabel>Tags</FieldLabel>
            <FieldDescription>
              Separate tags with commas (e.g. technology, tutorial,
              productivity). Maximum 5 tags.
            </FieldDescription>
            <Input
              value={tagsString}
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
          </Field>

          <Field>
            <FieldLabel>Excerpt</FieldLabel>
            <FieldDescription>
              Write a short summary of your post. This will appear in post
              previews, search results, and other listing pages.
            </FieldDescription>
            <Textarea
              value={excerpt}
              onChange={(e) => {
                const value = e.target.value;
                setExcerpt(value);
              }}
              maxLength={excerptLimit}
            />
            <p className="text-end text-muted-foreground text-xs">
              {excerpt.length} / {excerptLimit}
            </p>
          </Field>
        </FieldGroup>

        <FieldGroup className="col-span-1">
          <FieldGroup>
            <Field>
              <FieldLabel>SEO Title</FieldLabel>
              <FieldDescription>
                Appears as the page title in search engine results. Recommended:
                50–60 characters.
              </FieldDescription>
              <Input
                value={seoTitle}
                onChange={(e) => {
                  const value = e.target.value;
                  setSeoTitle(value);
                }}
              />
            </Field>

            <Field>
              <FieldLabel>SEO Description</FieldLabel>
              <FieldDescription>
                Appears below the title in search results. Recommended: 150–160
                characters.
              </FieldDescription>
              <Textarea
                value={seoDescription}
                onChange={(e) => {
                  const value = e.target.value;
                  setSeoDescription(value);
                }}
              />
            </Field>
          </FieldGroup>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}
