import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <section className="flex gap-4 md:gap-10 items-center md:items-start">
        <Skeleton className=" size-20 md:size-32 rounded-2xl shrink-0" />
        <div className="flex flex-col md:gap-4 w-full">
            <Skeleton className="h-10 w-full"/>
            <Skeleton className="h-40 w-full hidden sm:block"/>
        </div>
      </section>
       <Skeleton className="h-40 w-full block sm:hidden"/>
    </section>
  );
}
