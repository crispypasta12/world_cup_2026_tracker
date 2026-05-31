"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

interface TimezoneContextValue {
  timezone: string;
  setTimezone: (tz: string) => void;
}

const KEY = "wc2026_timezone";
const EVENT = "wc2026_timezone_changed";

const TimezoneContext = createContext<TimezoneContextValue>({
  timezone: "UTC",
  setTimezone: () => {},
});

function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return "UTC";
  return localStorage.getItem(KEY) ?? getBrowserTimezone();
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const timezone = useSyncExternalStore(subscribe, getSnapshot, () => "UTC");

  function setTimezone(tz: string) {
    localStorage.setItem(KEY, tz);
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  return useContext(TimezoneContext);
}
