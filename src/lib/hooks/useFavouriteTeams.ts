"use client";

import { useMemo, useSyncExternalStore } from "react";

const KEY = "wc2026_favourites";
const EVENT = "wc2026_favourites_changed";

function getSnapshot() {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(KEY) ?? "[]";
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

function parseFavourites(snapshot: string): number[] {
  try {
    const parsed = JSON.parse(snapshot);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is number => typeof value === "number")
      : [];
  } catch {
    return [];
  }
}

export function useFavouriteTeams() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const favourites = useMemo(() => parseFavourites(snapshot), [snapshot]);

  function toggleFavourite(id: number) {
    const next = favourites.includes(id)
      ? favourites.filter((x) => x !== id)
      : [...favourites, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }

  function isFavourite(id: number) {
    return favourites.includes(id);
  }

  return { favourites, toggleFavourite, isFavourite, mounted: true };
}
