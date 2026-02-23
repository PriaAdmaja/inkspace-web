"use client";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("@/components/text-editor/tiptap"), {
  ssr: false,
});

export default function NewIdea() {
  return (
      <section className="h-full">
        <TiptapEditor />
      </section>
  );
}
