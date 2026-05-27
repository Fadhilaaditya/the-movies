# 📚 INIT-LEARN — The Movies (Alan Movie)

Panduan cepat untuk memahami project ini.

---

## 🎯 Overview

**The Movies** — web app streaming & discovery film/TV series.
- **Data source:** TMDb API (The Movie Database)
- **Streaming:** vidsrc.me iframe embed
- **Trailer:** YouTube embed

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 15.3.1 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI | Tailwind CSS 4, Lucide React icons |
| Runtime | React 19, React DOM 19 |
| HTTP | Axios |
| Font | Plus Jakarta Sans (next/font) |
| Analytics | @vercel/analytics |
| Dev Tools | PostCSS, ESLint |

---

## 📁 Struktur Folder

```
the-movies/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Navbar + font)
│   ├── page.tsx                  # Home (Hero, NowPlaying, Popular)
│   ├── globals.css               # Tailwind, dark theme
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx        # Nav + genre dropdown + search
│   │   ├── feature/
│   │   │   ├── HeroSlider.tsx    # Full-bleed slider + YouTube bg
│   │   │   ├── NowPlaying.tsx    # Server component
│   │   │   ├── PopularMovies.tsx # Server component
│   │   │   └── PopularTv.tsx     # Server component
│   │   └── ui/
│   │       ├── SearchResultCard.tsx
│   │       ├── SkeletonCard.tsx
│   │       ├── TvEpisodeList.tsx
│   │       └── TvEpisodeSection.tsx
│   ├── Movie/                    # Browse all movies
│   │   ├── page.tsx              # Featured grid + pagination
│   │   └── [id]/page.tsx         # Movie detail (poster, cast, trailer)
│   ├── Tv/                       # Browse all TV series
│   │   ├── page.tsx              # Featured grid + pagination
│   │   └── [id]/page.tsx         # TV detail (seasons, episodes)
│   ├── Watch/[id]/page.tsx       # Embed player (vidsrc.me)
│   ├── Search/page.tsx           # Multi-search + pagination (client)
│   ├── Category/[id]/page.tsx    # Genre filter + pagination (client)
│   └── realease-year/page.tsx    # Filter by year, infinite scroll
├── public/                       # Static assets
├── .env                          # TMDb API key
├── next.config.ts                # Build config (ignore TS/ESLint errors)
├── tsconfig.json                 # strict, @/* path alias
├── postcss.config.mjs
└── package.json
```

---

## 🗺️ Route Map

| Route | Tipe | Deskripsi |
|---|---|---|
| `/` | Server | Homepage — hero slider + 3 section |
| `/Movie` | Client | Semua film (grid + pagination) |
| `/Movie/[id]` | Server | Detail film — info, trailer, cast |
| `/Tv` | Client | Semua serial TV (grid + pagination) |
| `/Tv/[id]` | Server | Detail TV — poster, season, episode |
| `/Watch/[id]` | Client | Player embed (vidsrc.me) |
| `/Search?q=` | Client | Search multi-kategori + pagination |
| `/Category/[id]` | Client | Filter genre + pagination |
| `/realease-year` | Client | Filter tahun rilis, infinite scroll |

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_TMDB_API_KEY=<your_tmdb_api_key>
```

Dapatkan API key di: https://www.themoviedb.org/settings/api

---

## 🚀 Quick Start

```bash
# Install
npm install

# Setup env
cp .env.example .env.local   # atau buat manual

# Dev
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint
```

Open → http://localhost:3000

---

## 🏗️ Arsitektur

- **Mixed SSR/CSR:** Komponen feature (NowPlaying, PopularMovies, PopularTv) = server components. Halaman Movie/Tv list, Search, Category, Year, Watch = client components.
- **API calls:** Langsung axios ke TMDb API dari server & client.
- **Pagination:** Manual di Movie, Tv, Category. Infinite scroll di release-year.
- **Styling:** Tailwind CSS 4 via `@tailwindcss/postcss`. Dark theme (zinc-950 bg), accent red-600.
- **Path alias:** `@/*` → root directory (configured di tsconfig.json).

---

## ⚠️ Known Issues

1. **API key exposed** — `.env` ter-commit ke repo. Gunakan `.env.local` dan tambahkan `.env` ke `.gitignore`.
2. **next.config.ts suppress errors** — TS/ESLint errors di-ignore saat build. Sebaiknya fix error, bukan suppress.
3. **Some `any` types** — Kurang type safety di beberapa komponen.
4. **Typo route** — `/realease-year` seharusnya `/release-year`.

---

## 📖 Further Reading

- [Next.js Docs](https://nextjs.org/docs)
- [TMDb API](https://developer.themoviedb.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [vidsrc.me](https://vidsrc.me) (streaming embed)
