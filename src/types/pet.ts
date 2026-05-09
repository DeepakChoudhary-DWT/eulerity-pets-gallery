// Shape of a pet object returned by the Eulerity /pets endpoint, plus
// a synthetic stable `id` we attach client-side so the detail route can
// look pets up reliably (the API response itself has no id field).

export interface RawPet {
  title: string;
  description: string;
  url: string;
  created: string;
}

export interface Pet extends RawPet {
  id: string;
  // File size in bytes, populated lazily via HEAD request. Undefined while
  // unknown; null when we tried and failed (e.g. CORS), so the UI can
  // distinguish "loading" from "unknown".
  sizeBytes?: number | null;
}

export type SortKey = 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest';
