import type { Metadata } from "next";
import { Monomakh, Montserrat } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import Header from "@/components/header/page-header";
import { auth } from "@/auth";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const monomakh = Monomakh({
  weight: "400",
  variable: "--font-monomakh",
});

export const metadata: Metadata = {
  title: "Inkspace",
  description: "Inkspace is a powerful blog platform for writers and creators to publish content, engage readers, and grow online.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} ${monomakh.variable} antialiased`}
      >
        <SessionProvider>
          <section className="min-h-screen">
            <Suspense>
              <Header user={session?.user} />
            </Suspense>

            {children}

          </section>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
