"use client";

import { useUserDataStore } from "@/store/user-data";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const userData = useUserDataStore((state) => state.userData);
  const hasHydrated = useUserDataStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (userData === null) {
      router.replace("/");
    }
  }, [router, userData, hasHydrated]);

  if (!hasHydrated || userData === null) {
    return null;
  }

  return <>{children}</>;
}
