import { ReactNode, Suspense } from "react";
import Header from "./header/page-header";

export default function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="min-h-screen">
      <Suspense>
        <Header />
      </Suspense>
      <section className="max-w-7xl mx-auto p-10">{children}</section>
    </section>
  );
}
