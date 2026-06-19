"use client";
import SignInButton from "../auth/auth-dialog";
import UserAvatar from "./user-avatar";
import SearchBar from "./search-bar";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { PencilLine } from "lucide-react";
import { routes } from "@/constants/routes";
import { usePathname } from "next/navigation";
import { useUserDataStore } from "@/store/user-data";

export default function Header({
  additionalComponent,
  className,
}: {
  additionalComponent?: ReactNode;
  className?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const userData = useUserDataStore((state) => state.userData);
  const hasHydrated = useUserDataStore((state) => state.hasHydrated);

  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "flex justify-between gap-2 items-center px-4 sm:px-10 py-4 sticky top-0 z-50 bg-background transition-all duration-300 ease-in-out",
        { "border-b border-border": isScrolled },
        className,
      )}
    >
      <Link href={"/"}>
        <p className=" text-xl sm:text-3xl font-bold font-monomakh">Inkspace</p>
      </Link>
      {isHomepage && <SearchBar />}
      <section
        className={cn("flex gap-4 items-center justify-end w-40", {
          invisible: !hasHydrated,
        })}
      >
        {additionalComponent}
        {isHomepage && !!userData && (
          <Button variant={"ghost"} asChild>
            <Link href={routes.newIdea}>
              <PencilLine />
              Write
            </Link>
          </Button>
        )}

        {!!userData ? <UserAvatar user={userData} /> : <SignInButton />}
      </section>
    </header>
  );
}
