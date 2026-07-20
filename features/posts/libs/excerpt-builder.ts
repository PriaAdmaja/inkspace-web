import { JSONContent } from "@tiptap/core";
import { excerptLimit } from "../edit-post/constant";

export function excerptBuilder(content?: JSONContent) {
  if (!content) return "";

  const result =
    content.content?.find((c) => c.type === "paragraph")?.content?.[0].text ??
    "";

  return result.length >= excerptLimit ? `${result.slice(0, excerptLimit-3)}...` : result;
}
