import { tiptapExtentions } from "@/components/text-editor/extentions";
import { generateText, JSONContent } from "@tiptap/core";

export function excerpBuilder(content?: JSONContent) {
  if (!content) return "";

  return generateText(content, tiptapExtentions()).replace(/\s+/g, " ")
  .trim();;
}
