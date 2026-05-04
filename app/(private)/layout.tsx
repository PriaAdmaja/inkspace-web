import AuthGuard from "@/components/wrapper/auth-guard";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
