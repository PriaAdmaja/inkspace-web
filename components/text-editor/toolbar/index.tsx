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
import Strike from "./components/strike";
import Codeblock from "./components/codeblock";
import Blockquote from "./components/blockquote";
import OrderedList from "./components/ordered-list";
import BulletList from "./components/bullet-list";
import Link from "./components/link";
import Unsplash from "./components/unsplash";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ListItemDropdown from "./components/list-item-dropdown";
import AlignDropdown from "./components/align-dropdown";
import { useMediaQueries } from "@/hooks/use-media-queries";
import HeadingDropdown from "./components/heading";

export default function Toolbar({ editor }: { editor: Editor | null }) {
  const { md } = useMediaQueries();
  return (
    <section className="flex gap-0.5 px-2 py-1 bg-neutral-200/80  rounded overflow-x-auto">
      {/* Basic Formatting Controls */}
      <GroupWrapper>
        <Bold editor={editor} />
        <Italic editor={editor} />
        <Strike editor={editor} />
        <Underline editor={editor} />
        <Highlight editor={editor} />
        <HeadingDropdown editor={editor} />
      </GroupWrapper>

      {md && <Separator className="bg-zinc-300 mx-1" />}

      {/* Alignment Controls */}
      <GroupWrapper className="hidden md:flex">
        <AlignLeft editor={editor} />
        <AlignCenter editor={editor} />
        <AlignRight editor={editor} />
        <AlignJustify editor={editor} />
      </GroupWrapper>
      <GroupWrapper className="flex md:hidden">
        <AlignDropdown editor={editor} />
      </GroupWrapper>

      {md && <Separator className="bg-zinc-300 mx-1" />}

      {/** List Controls */}
      <GroupWrapper className="hidden md:flex">
        <BulletList editor={editor} />
        <OrderedList editor={editor} />
      </GroupWrapper>
      <GroupWrapper className="flex md:hidden">
        <ListItemDropdown editor={editor} />
      </GroupWrapper>

      {md && <Separator className="bg-zinc-300 mx-1" />}

      {/* Other Controls */}
      <GroupWrapper className="hidden md:flex">
        <Link editor={editor} />
        <Codeblock editor={editor} />
        <Blockquote editor={editor} />
        <Unsplash editor={editor} />
      </GroupWrapper>
    </section>
  );
}

const GroupWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex gap-0.5", className)}>{children}</div>;
};
