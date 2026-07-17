import { Skeleton } from "@/components/ui/skeleton";

export default function PostItemSkeleteon() {
  return (
    <section className="flex flex-col-reverse sm:flex-row sm:gap-2 gap-4 justify-between w-full">
      <div className="flex-1 space-y-2 sm:space-y-3 md:space-y-5 lg:space-y-7">
        <Skeleton className="h-5 sm:h-8 w-full" />

        <div className="space-y-2">
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-4 w-full hidden sm:block" />
        </div>
      </div>
      <Skeleton className="w-full h-32 sm:size-32 lg:size-40 shrink-0" />
    </section>
  );
}
