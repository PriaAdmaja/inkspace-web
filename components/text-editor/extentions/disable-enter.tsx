import { Extension } from "@tiptap/core"

export const DisableEnter = Extension.create({
  name: "disableEnter",

  addKeyboardShortcuts() {
    return {
      Enter: () => true, // returning true prevents default behavior
    }
  },
})