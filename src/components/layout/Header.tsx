"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTimezone } from "@/lib/context/TimezoneContext";
import SearchPalette from "@/components/ui/SearchPalette";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/groups", label: "Groups" },
  { href: "/schedule", label: "Schedule" },
  { href: "/bracket", label: "Bracket" },
  { href: "/teams", label: "Teams" },
  { href: "/scorers", label: "Scorers" },
  { href: "/venues", label: "Venues" },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "ET (NY)" },
  { value: "America/Chicago", label: "CT" },
  { value: "America/Denver", label: "MT" },
  { value: "America/Los_Angeles", label: "PT (LA)" },
  { value: "America/Toronto", label: "ET (TO)" },
  { value: "America/Vancouver", label: "PT (VAN)" },
  { value: "America/Mexico_City", label: "CST (MX)" },
  { value: "America/Sao_Paulo", label: "BRT" },
  { value: "Europe/London", label: "BST/GMT" },
  { value: "Europe/Paris", label: "CET" },
  { value: "Europe/Berlin", label: "CET (DE)" },
  { value: "Europe/Moscow", label: "MSK" },
  { value: "Asia/Dubai", label: "GST" },
  { value: "Asia/Kolkata", label: "IST" },
  { value: "Asia/Shanghai", label: "CST (CN)" },
  { value: "Asia/Tokyo", label: "JST" },
  { value: "Asia/Seoul", label: "KST" },
  { value: "Australia/Sydney", label: "AEST" },
];

export default function Header() {
  const pathname = usePathname();
  const { timezone, setTimezone } = useTimezone();
  const [searchOpen, setSearchOpen] = useState(false);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    fetch("/api/today")
      .then((r) => r.json())
      .then((d) => setTodayCount(d.count ?? 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-3">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl">⚽</span>
              <span className="font-bold text-white text-sm">WC 2026</span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-0.5 overflow-x-auto flex-1 min-w-0 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
              {NAV.map(({ href, label }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {label}
                    {href === "/schedule" && todayCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] bg-green-500 text-white rounded-full font-bold leading-none">
                        {todayCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="text-xs bg-white/5 border border-white/10 text-slate-300 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-white/10 transition-colors focus:outline-none hidden sm:block"
                title="Select timezone"
              >
                {!TIMEZONES.some((tz) => tz.value === timezone) && (
                  <option value={timezone} className="bg-slate-800 text-white">
                    {timezone}
                  </option>
                )}
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value} className="bg-slate-800 text-white">
                    {tz.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Search (⌘K)"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="hidden sm:inline text-xs">Search</span>
                <kbd className="hidden lg:inline text-[10px] text-slate-600">⌘K</kbd>
              </button>
            </div>
          </div>
        </div>
      </header>

      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} />}
    </>
  );
}
