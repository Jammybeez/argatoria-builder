import "~/styles/globals.css";

import { type Metadata } from "next";
import { Cinzel, Geist } from "next/font/google";

import { Nav } from "~/app/_components/nav";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Argatoria Builder",
  description: "Build and save Argatoria army lists",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${cinzel.variable}`}>
      <body className="min-h-screen bg-ink text-parchment print:bg-white print:text-stone-900">
        <TRPCReactProvider>
          <Nav />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
