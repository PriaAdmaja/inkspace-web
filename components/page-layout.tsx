import { ReactNode, Suspense } from "react";
import Header from "./header/page-header";
import { Session } from "next-auth";

export default function PageLayout({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <section className="min-h-screen">
      <Suspense>
        <Header user={session?.user} />
      </Suspense>
      <section className="max-w-7xl mx-auto p-10">{children}</section>
    </section>
  );
}
