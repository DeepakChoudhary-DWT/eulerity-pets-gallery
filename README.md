# Eulerity Pets — Web Take-Home Challenge

A polished React + TypeScript front-end for the Eulerity hackathon. Fetches pets from `/pets`, lets users browse, search, sort, multi-select, and download as a ZIP.

> **Live API:** https://eulerity-hackathon.appspot.com/pets

---

## Tech stack

- **Vite 8** + **React 19** + **TypeScript** (strict mode)
- **react-router-dom v7** — routing
- **styled-components v6** — themeable CSS-in-JS
- **JSZip** + **file-saver** — bundle selected images as a ZIP
- No external state library — Context API is enough for this app

## Features

- Fetch from `/pets` with loading / error / empty / success states
- Card grid showing image, title, description, creation date, and (when available) file size
- Multi-select with persistent global state across routes
- Live count + estimated total size for selected items
- **Select All** / **Clear Selection** / **Download ZIP** controls
- Sort: Name A→Z, Z→A, Date newest, Date oldest
- Search by title or description (debounced)
- Detail route at `/pets/:id` with full image and metadata
- Home and About pages
- Custom hook (`usePets`) for data — handles loading, error, and empty
- Infinite scroll via `IntersectionObserver`
- Responsive: 1 col mobile, 2 col tablet, 4 col desktop
- Loading skeletons, empty messages, error retry button, disabled buttons
- Strong visual indication for selected cards
- Graceful CORS handling on ZIP download

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Type-check (no build)
npm run typecheck

# 4. Production build
npm run build

# 5. Preview production build
npm run preview
```

The app talks to `https://eulerity-hackathon.appspot.com/pets` directly. You can override the API base by setting `VITE_API_BASE` (e.g. when proxying behind your own backend).

## Folder structure

```
src/
  api/                # fetch wrappers
  components/         # presentational components, grouped by concern
  context/            # SelectionContext (global state)
  hooks/              # usePets, useDebounce, useInfiniteScroll
  pages/              # route components
  styles/             # theme + global styles
  types/              # shared TypeScript types
  utils/              # id hashing, file-size formatting, ZIP download
  App.tsx             # router + providers
  main.tsx            # entry
```

## Architecture notes

- **Data layer.** `api/pets.ts` wraps `fetch`. The `usePets` hook owns the lifecycle (`AbortController`, manual `tick`-based refetch, lazy size hydration via HEAD requests). Status is one of `idle | loading | success | error | empty` so the UI never has to guess.
- **Stable ids.** The Eulerity payload has no `id`, so each pet gets a deterministic `stableId(url)` derived via a djb2 hash. The `/pets/:id` route is stable across reloads, and `Set<id>`-based selection works without indices.
- **Selection.** `SelectionContext` keeps a `Set<string>` at the router root, above all routes. Detail-page navigation can never lose state. Helpers like `totalSize(allPets)` derive size on demand from the live data.
- **Pagination.** Client-side, since the entire `/pets` payload is small. We render the first 12 cards and grow by 12 each time an `IntersectionObserver` sentinel intersects the viewport. Resets to 12 whenever filter/sort changes so you don't get stale rows.
- **Sizes & downloads.** File size comes from a HEAD request when CORS permits; otherwise we render `—`. The ZIP download tries `fetch` per image, skips any CORS rejects, and reports skipped count to the user. If 0 succeed, we surface a clear CORS notice instead of failing silently.
- **Theming.** `theme.ts` is a const object augmenting `DefaultTheme`, so every styled component gets a fully-typed `props.theme.*`.
- **Responsiveness.** Pure CSS Grid breakpoints in `PetGrid` — 1 / 2 / 4 columns at 0 / 640 / 1024 px.

## Key technical decisions

| Decision | Why |
| --- | --- |
| Context over Redux | The selection set is the only global state; Redux would be overhead. |
| HEAD requests + CORS-tolerant fallbacks | Eulerity images are on a CDN we don't control; "graceful unknown" beats crashing. |
| Infinite scroll instead of paginated buttons | Better UX for browsing images; the dataset is small enough to cache fully. |
| `stableId` via hash, not array index | Indices are not stable across sort/filter; URL-derived hashes are. |
| Strict TypeScript, `noUnusedLocals/Parameters` | Catches drift before runtime. |

## Assumptions

- The `/pets` endpoint returns a flat JSON array of `{ title, description, url, created }`.
- Image URLs are publicly accessible but may not have permissive CORS, so HEAD/`fetch` calls for sizes and downloads are best-effort.
- No auth required.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and produce a production bundle |
| `npm run preview` | Serve the built bundle locally |
| `npm run typecheck` | Strict TS check, no emit |
| `npm run lint` | Run ESLint |
