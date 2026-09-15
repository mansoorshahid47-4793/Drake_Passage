"use client";

import { useCallback, useState } from "react";

export function relativeOffset(i: number, index: number, count: number): number {
  let d = i - index;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
}

export function useDialState(count: number, initial = 0) {
  const [index, setIndex] = useState(initial);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  return { index, next, prev, goTo };
}
