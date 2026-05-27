# 🎨 DESIGN UPGRADE PLAN — The Movies (Minimalist Streaming UI)

## Konsep Desain

**Prinsip:** Clean, spacious, dark-first, glassmorphism accents, smooth transitions.

**Inspirasi gaya:**
- Apple TV+ (clean layout, large hero, minimal text)
- Letterboxd (card-based, focus on poster art)
- Disney+ (smooth hover animations, layered depth)

---

## Phase 1 — Foundation & Layout

| Task | Detail |
|---|---|
| Dark theme upgrade | Ganti `zinc-950` → gradient `slate-950` to `gray-900`, subtle grain texture |
| Typography | Hierarchy lebih jelas: hero title besar (4xl-6xl), body clean (sm-base) |
| Spacing | Lebih generous — `py-16` antar section, `gap-6` grid |
| Navbar redesign | Glassmorphism (`backdrop-blur-xl bg-black/30`), sticky, slim |
| Loading states | `loading.tsx` per route dengan skeleton shimmer animation |

## Phase 2 — Components

| Task | Detail |
|---|---|
| Hero Slider | Full viewport height, gradient overlay dari bawah, minimal info (title + genre + CTA) |
| Movie Cards | Rounded-xl, hover scale + shadow glow, overlay gradient on hover dengan title |
| Detail Modal | Intercepting route (`(.)Movie/[id]`) — modal overlay tanpa pindah halaman |
| Poster hover | `group-hover:scale-105 transition-transform duration-300` |
| Glassmorphism cards | `bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl` |

## Phase 3 — UX Improvements

| Task | Detail |
|---|---|
| Smooth page transitions | CSS transitions antar route |
| Infinite scroll | Ganti pagination manual → intersection observer (semua halaman list) |
| Search overlay | Full-screen search modal dengan backdrop blur, bukan halaman terpisah |
| Genre chips | Horizontal scroll pills, bukan dropdown |
| Skeleton loading | Pulse animation cards saat data loading |

## Phase 4 — Polish

| Task | Detail |
|---|---|
| Micro-interactions | Button hover glow, card tilt subtle |
| Color accent | Dari `red-600` → gradient `rose-500` to `pink-500` |
| Image optimization | Next.js `<Image>` dengan `placeholder="blur"` + proper sizes |
| Responsive grid | `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6` |
| Accessibility | Focus rings, aria-labels, keyboard navigation |

---

## Tailwind Patterns

```tsx
// Glassmorphism card
<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">

// Hover glow effect
<div className="group hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-300">

// Gradient overlay on poster
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">

// Dark navbar
<nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-white/5">
```

## Next.js Patterns

```
app/
├── @modal/                    # Parallel route slot untuk modal
│   └── (.)Movie/[id]/page.tsx # Intercepted route → detail modal
├── loading.tsx                # Global skeleton
├── Movie/
│   ├── loading.tsx            # Movie list skeleton
│   └── [id]/
│       └── loading.tsx        # Detail skeleton
```

---

## Prioritas Eksekusi

1. **Navbar + Layout** (fondasi visual)
2. **Movie Cards + Grid** (komponen paling sering dilihat)
3. **Hero Slider** (first impression)
4. **Detail page + Modal** (UX upgrade)
5. **Search + Polish** (finishing)

---

## Color Palette

| Role | Color |
|---|---|
| Background base | `slate-950` |
| Background gradient | `from-slate-950 via-gray-950 to-slate-900` |
| Card glass | `bg-white/5` |
| Card border | `border-white/10` |
| Primary accent | `rose-500` to `pink-500` (gradient) |
| Text primary | `white` / `slate-50` |
| Text secondary | `slate-400` |
| Text muted | `slate-500` |
