import type { Metadata } from "next";
import { Monomakh, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import PageLayout from "@/components/page-layout";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
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
        className={`${montserrat.className} ${monomakh.variable} antialiased`}
      >
          <PageLayout>{children}</PageLayout>
        <Toaster position="top-center"/>
      </body>
    </html>
  );
}
