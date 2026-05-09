import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Pet } from '@/types/pet';

/**
 * Derive a filename from an image URL, falling back to "pet-<id>.jpg".
 * Strips query strings and keeps the original extension when present.
 */
function filenameFor(pet: Pet): string {
  try {
    const u = new URL(pet.url);
    const last = u.pathname.split('/').filter(Boolean).pop();
    if (last && /\.[a-z0-9]+$/i.test(last)) return decodeURIComponent(last);
  } catch {
    /* fall through */
  }
  return `pet-${pet.id}.jpg`;
}

/**
 * Fetch each selected image as a blob, bundle them into a ZIP, and trigger
 * a download. Returns a structured result so the UI can show how many
 * images were skipped because of CORS.
 */
export interface DownloadResult {
  zipped: number;
  skipped: number;
  total: number;
}

export async function downloadAsZip(pets: Pet[]): Promise<DownloadResult> {
  const zip = new JSZip();
  let zipped = 0;
  let skipped = 0;

  // Run fetches in parallel; CORS failures should not abort the batch.
  await Promise.all(
    pets.map(async (pet) => {
      try {
        const res = await fetch(pet.url, { mode: 'cors' });
        if (!res.ok) {
          skipped++;
          return;
        }
        const blob = await res.blob();
        zip.file(filenameFor(pet), blob);
        zipped++;
      } catch {
        skipped++;
      }
    }),
  );

  if (zipped === 0) {
    // Nothing made it into the zip; surface this to the caller so it can
    // show a helpful CORS message.
    return { zipped: 0, skipped, total: pets.length };
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `eulerity-pets-${new Date().toISOString().slice(0, 10)}.zip`);

  return { zipped, skipped, total: pets.length };
}
