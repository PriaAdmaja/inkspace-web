import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { ComponentProps } from "react";

type ToolbarButtonProps = ComponentProps<typeof Button> & {
  active?: boolean;
  toolbarName?: string;
};

export default function ToolbarButton({
  children,
  active,
  toolbarName,
  ...props
}: ToolbarButtonProps) {
  const { sm } = useMediaQueries();

  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild>
        <Button
          size={sm ? "sm" : "xs"}
          variant={active ? "secondary" : "ghost"}
          {...props}
          tabIndex={-1}
        >
          {children}
        </Button>
      </TooltipTrigger>
      {toolbarName && (
        <TooltipContent side="bottom">
          <p>{toolbarName}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
