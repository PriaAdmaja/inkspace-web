import { ReactNode, Suspense } from "react";
import Header from "./header/page-header";
import BackTopButton from "./back-top-button";

export default function PageLayout({
  children,
  headerAdditionalComponent,
  headerClassName,
  headerContentClassName,
  isDisableLogout,
}: {
  children: ReactNode;
  headerAdditionalComponent?: ReactNode;
  headerClassName?: string;
  headerContentClassName?: string;
  isDisableLogout?: boolean;
}) {
  return (
    <section className="min-h-screen relative">
      <Suspense>
        <Header
          additionalComponent={headerAdditionalComponent}
          className={headerClassName}
          contentClassName={headerContentClassName}
          isDisableLogout={isDisableLogout}
        />
      </Suspense>
      <section className="max-w-7xl mx-auto p-4 sm:p-10 flex-1">
        {children}
      </section>

      <Suspense>
        <BackTopButton className="fixed bottom-5 right-5" />
      </Suspense>
    </section>
  );
}
