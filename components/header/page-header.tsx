"use client";
import SignInButton from "../auth/sign-in-button";
import UserAvatar from "./user-avatar";
import { User } from "next-auth";
import SearchBar from "./search-bar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { PencilLine } from "lucide-react";
import { routes } from "@/constants/routes";
import { usePathname } from "next/navigation";

export default function Header({ user }: { user?: User }) {
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();

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
        "flex justify-between gap-2 items-center px-10 py-4 sticky top-0 z-50 bg-background transition-all duration-300 ease-in-out",
        { "border-b border-border": isScrolled },
      )}
    >
      <Link href={"/"}>
        <p className="text-3xl font-bold font-monomakh">Inkspace</p>
      </Link>

      {isHomepage && <SearchBar />}

      <section className="flex gap-4 items-center">
        {isHomepage && !!user && (
          <Button variant={"ghost"} asChild>
            <Link href={routes.newIdea}>
              <PencilLine />
              Write
            </Link>
          </Button>
        )}

        {!!user ? <UserAvatar user={user} /> : <SignInButton />}
      </section>
    </header>
  );
}
