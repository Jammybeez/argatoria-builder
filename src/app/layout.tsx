import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { type Metadata } from "next";
import { Cinzel, Geist } from "next/font/google";
import Script from "next/script";

import { Nav } from "~/app/_components/nav";
import { TRPCReactProvider } from "~/trpc/react";

// Sets data-theme before hydration so there's no flash of the wrong theme:
// stored choice wins, otherwise falls back to the OS preference.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme")||(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

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
    <html
      lang="en"
      className={`${geist.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink text-parchment print:bg-white print:text-stone-900">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <TRPCReactProvider>
          <Nav />
          {children}
        </TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}
