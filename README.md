# Dexa

**Every Pokémon, one clean dex.** A bright, fast Pokédex for all 1025 species — searchable by name or number, filterable by type, generation and rarity, with stats, evolution lines, cries and a favourites shelf.

[![CI](https://github.com/Faizan-khan144/dexa/actions/workflows/ci.yml/badge.svg)](https://github.com/Faizan-khan144/dexa/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-14121a?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-2f6fed?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-7c3aed?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-0f766e?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-e3354d)

## What it does

- **Search the whole dex** — all 1025 species, by name or dex number, with artwork thumbnails in the suggestion dropdown.
- **Filter without waiting** — type, generation (I–IX) and a legendary & mythical switch, all reflected in the URL so a filtered dex is shareable.
- **Read a species properly** — official artwork, genus, flavour text, abilities, physical data, animated base stats and a full defensive type chart.
- **Follow the evolution line** — every stage, with jumps straight to the species page.
- **Hear the cry** — one tap on the species page plays the current PokéAPI cry.
- **Keep a shelf** — heart any species and it persists in `localStorage`; no accounts, no server.
- **Rarity that means something** — Mythical, Legendary, Rare, Uncommon and Common tiers derived from official status and capture rate.

## Rarity tiers

| Tier | How it is decided |
| --- | --- |
| Mythical | `is_mythical` on the species record |
| Legendary | `is_legendary` on the species record |
| Rare | Catch rate of 45 or lower |
| Uncommon | Catch rate between 46 and 120 |
| Common | Everything else |

Cards show legendary and mythical status without extra requests, using a static id set; the detail page computes the full tier from the species record.

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + a hand-rolled design system in `src/index.css` |
| Routing | React Router 7 |
| State | Zustand 5 with `persist` |
| Icons | lucide-react |
| Data | [PokéAPI](https://pokeapi.co) (no key required) |
| Motion | CSS transitions/keyframes + IntersectionObserver — no animation library |

## Run it locally

```bash
git clone https://github.com/Faizan-khan144/dexa.git
cd dexa
npm install
npm run dev
```


> On npm 12+, install scripts are blocked by default. If esbuild fails to start, run `npm install-scripts approve esbuild` and then `npm rebuild esbuild`.

## Usage

1. Open the app — the full dex loads on the home screen.
2. Search by name or dex number, or filter by type, generation and legendary status. Filters are written to the URL, so a filtered view can be shared.
3. Open a species for artwork, flavour text, abilities, animated stats and the defensive type chart.
4. Tap the cry button to hear it, and heart a species to keep it on your shelf. The shelf lives in `localStorage`, so it survives a refresh without an account.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check with `tsc -b`, then production build |
| `npm run typecheck` | TypeScript project build only |
| `npm run lint` | oxlint over `src` |
| `npm run preview` | Preview the production build |

## Project structure

```
src/
  components/   Logo, header, footer, search dock, cards, rarity badge, stat bars, reveal, marquee
  lib/          PokéAPI data layer: cache, index, types, generations, rarity, evolution, matchups
  pages/        Landing, Dex, Detail, Favorites, NotFound
  store/        Zustand favourites store (persisted)
  index.css     Design tokens, utilities and motion
```

## Data and caching

- The 1025-name index is cached in `localStorage` for 24 hours (`dexa:index:v1`).
- Species, pokémon, evolution and type responses are memoised in memory for 30 minutes per session.
- Artwork and sprites come from the PokeAPI sprites repository; cries come from PokéAPI's `cries` field.

## Deploy

The repo ships with `vercel.json` (SPA rewrite) for Vercel:

```bash
npm i -g vercel
vercel --prod
```

Any static host works — build with `npm run build` and serve `dist` with an SPA fallback to `index.html`.

## Author

Built by **Faizan Khan** — [GitHub](https://github.com/Faizan-khan144).

## Disclaimer

Dexa is an unofficial fan project. Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc. and GAME FREAK inc. Data is provided by [PokéAPI](https://pokeapi.co). No affiliation with or endorsement by The Pokémon Company is implied.
