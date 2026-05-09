import type { Pet, RawPet } from '@/types/pet';
import { stableId } from '@/utils/id';

// Eulerity's public endpoint. Override at build time with VITE_API_BASE
// if you need to point at a proxy.
const API_BASE =
  import.meta.env.VITE_API_BASE ?? 'https://eulerity-hackathon.appspot.com';

/**
 * Fetch the full pet list. The endpoint returns a flat JSON array; we
 * augment each item with a stable client-side id so router params work.
 */
export async function fetchPets(signal?: AbortSignal): Promise<Pet[]> {
  const res = await fetch(`${API_BASE}/pets`, { signal });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as RawPet[];

  if (!Array.isArray(data)) {
    throw new Error('Unexpected response shape from /pets');
  }

  return data.map((p) => ({ ...p, id: stableId(p.url) }));
}

/**
 * Best-effort HEAD request to discover the size of an image. Many image
 * CDNs disallow this via CORS; the caller should treat `null` as "unknown".
 */
export async function fetchPetSize(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { method: 'HEAD', mode: 'cors' });
    if (!res.ok) return null;
    const len = res.headers.get('content-length');
    return len ? Number(len) : null;
  } catch {
    return null;
  }
}
