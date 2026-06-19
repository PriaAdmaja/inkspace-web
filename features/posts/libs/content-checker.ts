import { JSONContent } from "@tiptap/core";

function hasContent(content: JSONContent): boolean {
  if (!content) return false;

  // Text content
  if (content.type === "text") {
    if (content.text) {
      return content.text?.trim().length > 0;
    }
    return false;
  }

  // Non-text content contents
  if (
    content.type &&
    [
      "image",
      "video",
      "table",
      "codeBlock",
      "horizontalRule",
      "blockquote",
    ].includes(content.type)
  ) {
    return true;
  }

  return content.content?.some(hasContent) ?? false;
}

export function isContentEmpty(content: JSONContent): boolean {
  return !hasContent(content);
}
