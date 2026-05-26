import { Editor } from "@tiptap/core";
import Bold from "./components/bold";
import Italic from "./components/italic";
import Underline from "./components/underline";
import AlignLeft from "./components/align-left";
import AlignCenter from "./components/align-center";
import AlignRight from "./components/align-right";
import AlignJustify from "./components/align-justify";
import Highlight from "./components/highlight";
import Separator from "./components/shared/separator";

export default function Toolbar({ editor }: { editor: Editor | null }) {
  return (
    <section className="flex gap-0.5 px-2 py-1 bg-zinc-200  rounded">
      {/* Basic Formatting Controls */}
      <Bold editor={editor} />
      <Italic editor={editor} />
      <Underline editor={editor} />
      <Highlight editor={editor} />

      <Separator className="bg-zinc-300 mx-1"/>

      {/* Alignment Controls */}
      <AlignLeft editor={editor} />
      <AlignCenter editor={editor} />
      <AlignRight editor={editor} />
      <AlignJustify editor={editor} />
    </section>
  );
}
