import { JSONContent } from "@tiptap/core";

export function excerptBuilder(content?: JSONContent) {
  if (!content) return "";

  const result = content.content?.find((c) => c.type === "paragraph")?.content?.[0].text ?? "";

  return result;
}
