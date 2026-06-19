import PageLayout from "@/components/page-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostSkeleton() {
  return (
    <PageLayout>
      <section className="flex flex-col gap-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-full h-125" />
      </section>
    </PageLayout>
  );
}
