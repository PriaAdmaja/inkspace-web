import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";

type ToolbarButtonProps = ComponentProps<typeof Button> & {
  active?: boolean;
};

export default function ToolbarButton({
  children,
  active,
  ...props
}: ToolbarButtonProps) {
  return (
    <Button size={"icon-sm"} variant={active ? "secondary" : "ghost"} {...props}>
      {children}
    </Button>
  );
}
