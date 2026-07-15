"use client";
import SignInButton from "../auth/auth-dialog";
import UserAvatar from "./user-avatar";
import Link from "next/link";
import { ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowLeft, PencilLine, SearchIcon } from "lucide-react";
import { routes } from "@/constants/routes";
import { usePathname } from "next/navigation";
import { useUserDataStore } from "@/store/user-data";
import SearchInput from "./search-bar/search-input";

export default function Header({
  additionalComponent,
  className,
}: {
  additionalComponent?: ReactNode;
  className?: string;
}) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isSearchHeader, setIsSearchHeader] = useState<boolean>(false);

  const pathname = usePathname();
  const userData = useUserDataStore((state) => state.userData);
  const hasHydrated = useUserDataStore((state) => state.hasHydrated);

  const searchRef = useRef<HTMLInputElement>(null);

  const hideNewPostRoutes = ["/new-idea", "/edit"].some((r) =>
    pathname.endsWith(r),
  );
  const showNewPostLink = hideNewPostRoutes === false && !!userData;
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchHeader) {
      searchRef.current?.focus();
    }
  }, [isSearchHeader]);

  return (
    <header
      className={cn(
        "flex justify-between gap-2 items-center px-4 sm:px-10 py-4 sticky top-0 z-50 bg-background transition-all duration-300 ease-in-out",
        { "border-b border-border": isScrolled },
        className,
      )}
    >
      {isSearchHeader ? (
        <>
          {/** Seach bar in mobile view */}
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setIsSearchHeader(false)}
          >
            <ArrowLeft />
          </Button>

          <Suspense>
            <SearchInput ref={searchRef} />
          </Suspense>
        </>
      ) : (
        <>
          {/** Logo */}
          <Link href={"/"}>
            <p className="text-2xl sm:text-3xl font-bold font-monomakh">
              Inkspace
            </p>
          </Link>

          {/** Search bar in large screen */}
          {isHomePage && (
            <Suspense>
              <SearchInput classname="hidden sm:flex" />
            </Suspense>
          )}

          <section
            className={cn("flex gap-2 sm:gap-4 items-center justify-end w-40", {
              invisible: !hasHydrated,
            })}
          >
            {/** Button to display search bar in mobile   */}
            {isHomePage && (
              <Button
                size={"icon"}
                variant={"ghost"}
                className="flex sm:hidden"
                onClick={() => {
                  setIsSearchHeader(true);
                }}
              >
                <SearchIcon />
              </Button>
            )}

            {additionalComponent}

            {/** Link button to create new post */}
            {showNewPostLink && (
              <Button variant={"ghost"} asChild>
                <Link href={routes.newIdea}>
                  <PencilLine />
                  <span className="hidden sm:block">Write</span>
                </Link>
              </Button>
            )}

            {/** User Menu */}
            {!!userData ? <UserAvatar user={userData} /> : <SignInButton />}
          </section>
        </>
      )}
    </header>
  );
}
