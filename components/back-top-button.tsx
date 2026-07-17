"use client";
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function BackTopButton({ className }: { className?: string }) {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setShow(window.scrollY > 500);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Button
      size={"icon"}
      className={cn(
        "hover:scale-105 transition-all ease-out duration-300 scale-0",
        { "scale-100": show },
        className,
      )}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    >
      <ArrowUp />
    </Button>
  );
}
