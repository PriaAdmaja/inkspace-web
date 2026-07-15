import { cn } from "@/lib/utils";
import { NodeViewWrapper } from "@tiptap/react";

export function UnsplashImageView({
  node,
  selected,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any;
  selected: boolean;
}) {
  return (
    <NodeViewWrapper>
      <section
        className={cn(
          "my-6 flex flex-col items-center w-full gap-3 ",
          selected &&  "ring-2 ring-blue-500",
        )}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt}
          className="object-cover max-w-4/5 max-h-[700px]"
        />

        <p className="mt-2 text-xs text-muted-foreground">
          Photo by{" "}
          <a
            href={node.attrs.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {node.attrs.photographerName}
          </a>{" "}
          on{" "}
          <a
            href={"https://unsplash.com"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            Unsplash
          </a>
        </p>
      </section>
    </NodeViewWrapper>
  );
}
