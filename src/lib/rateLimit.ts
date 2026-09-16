const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function prune(now: number) {
  for (const [k, times] of hits) {
    const recent = times.filter((t) => now - t < WINDOW_MS);
    if (recent.length === 0) hits.delete(k);
    else hits.set(k, recent);
  }
}

export function allow(key: string, now = Date.now()): boolean {
  prune(now);
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) { hits.set(key, recent); return false; }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function _reset() { hits.clear(); }
export function _size() { return hits.size; }
