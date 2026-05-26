import { ReactNode, Suspense } from "react";
import Header from "./header/page-header";
import { cn } from "@/lib/utils";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <section className={cn("min-h-screen")}>
      <Suspense>
        <Header />
      </Suspense>
      <section className={cn("max-w-7xl mx-auto p-10 flex-1")}>
        {children}
      </section>
    </section>
  );
}
