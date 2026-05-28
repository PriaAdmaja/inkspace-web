import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
          <Button
            size={"icon-sm"}
            variant={active ? "secondary" : "ghost"}
            {...props}
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
