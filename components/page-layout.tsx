import { ReactNode, Suspense } from "react";
import Header from "./header/page-header";
import { cn } from "@/lib/utils";

export default function PageLayout({ children, headerComponent }: { children: ReactNode; headerComponent?: ReactNode }) {
  return (
    <section className={cn("min-h-screen")}>
      <Suspense>
        <Header additionalComponent={headerComponent} />
      </Suspense>
      <section className={cn("max-w-7xl mx-auto p-4 sm:p-10 flex-1")}>
        {children}
      </section>
    </section>
  );
}
