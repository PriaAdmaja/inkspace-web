import { ReactNode, Suspense } from "react";
import Header from "./header/page-header";
import { cn } from "@/lib/utils";

export default function PageLayout({
  children,
  headerAdditionalComponent,
  headerClassName,
  headerContentClassName,
}: {
  children: ReactNode;
  headerAdditionalComponent?: ReactNode;
  headerClassName?: string;
  headerContentClassName?: string;
}) {
  return (
    <section className={cn("min-h-screen")}>
      <Suspense>
        <Header
          additionalComponent={headerAdditionalComponent}
          className={headerClassName}
          contentClassName={headerContentClassName}
        />
      </Suspense>
      <section className={cn("max-w-7xl mx-auto p-4 sm:p-10 flex-1")}>
        {children}
      </section>
    </section>
  );
}
