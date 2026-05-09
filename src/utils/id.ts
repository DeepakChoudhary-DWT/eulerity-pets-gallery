/**
 * Deterministic short id from a string (djb2 hash, base-36).
 * Used to derive a stable id from each pet's image URL since the API
 * doesn't return one.
 */
export function stableId(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) + h + input.charCodeAt(i);
    h |= 0; // force int32
  }
  return Math.abs(h).toString(36);
}
