"use client";

import { useState, useEffect } from "react";

const KEY = "wc2026_favourites";

export function useFavouriteTeams() {
  const [favourites, setFavourites] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setFavourites(JSON.parse(stored));
    } catch {}
  }, []);

  function toggleFavourite(id: number) {
    setFavourites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function isFavourite(id: number) {
    return favourites.includes(id);
  }

  return { favourites, toggleFavourite, isFavourite, mounted };
}
