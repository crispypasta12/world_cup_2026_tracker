import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Providers from "@/lib/context/Providers";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "World Cup 2026 Tracker",
  description: "Live scores, standings, and bracket for the 2026 FIFA World Cup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-slate-100 antialiased">
        <Providers>
          <Header />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {children}
          </main>
          <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-600">
            Data provided by{" "}
            <a
              href="https://www.football-data.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-400 underline"
            >
              football-data.org
            </a>
          </footer>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
