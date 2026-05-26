import { cn } from "@/lib/utils";

export default function Separator({ className }: { className?: string }) {
  return <div className={cn("shrink-0 bg-border w-px ", className)}></div>;
}
