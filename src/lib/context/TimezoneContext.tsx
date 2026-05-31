"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface TimezoneContextValue {
  timezone: string;
  setTimezone: (tz: string) => void;
}

const TimezoneContext = createContext<TimezoneContextValue>({
  timezone: "UTC",
  setTimezone: () => {},
});

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezoneState] = useState("UTC");

  useEffect(() => {
    const stored = localStorage.getItem("wc2026_timezone");
    if (stored) {
      setTimezoneState(stored);
    } else {
      const browser = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezoneState(browser);
    }
  }, []);

  function setTimezone(tz: string) {
    setTimezoneState(tz);
    localStorage.setItem("wc2026_timezone", tz);
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
