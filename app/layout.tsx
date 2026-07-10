import type { Metadata } from "next";
import { Google_Sans, Monomakh } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavigationGuardProvider } from "next-navigation-guard";
import NextTopLoader from "nextjs-toploader";
import QueryClientProvider from "@/components/wrapper/query-client-provider";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  adjustFontFallback: true,
});

const monomakh = Monomakh({
  weight: "400",
  variable: "--font-monomakh",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inkspace",
  description:
    "Inkspace is a powerful blog platform for writers and creators to publish content, engage readers, and grow online.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${googleSans.className} ${monomakh.variable} ${googleSans.variable} antialiased`}
      >
        <NextTopLoader
          showSpinner={false}
          color="var(--foreground)"
          height={2}
        />
        <NavigationGuardProvider>
          <TooltipProvider delayDuration={300} skipDelayDuration={0}>
            <QueryClientProvider>{children}</QueryClientProvider>
          </TooltipProvider>
        </NavigationGuardProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
