"use client";

import { TimezoneProvider } from "./TimezoneContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TimezoneProvider>{children}</TimezoneProvider>;
}
