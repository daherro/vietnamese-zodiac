# Vietnamese Zodiac / Tử Vi app

React 19 + Vite + TS. Plain CSS tokens (`src/theme/tokens.css`), `motion` for
animation, react-router. All calculation is client-side; no backend. Deploys as
a static Vite build on Vercel.

## Domain rules — do not "simplify" these

- **Year pillar comes from the LUNAR year** (Tết boundary), never
  `(year - 4) % 12` on the Gregorian year. Early-January births belong to the
  prior animal. Tests cover this.
- Lunar conversion is Hồ Ngọc Đức's algorithm at **UTC+7** (Vietnamese
  calendar; diverges from the Chinese calendar in some years, e.g. Tết 1985).
- 23:00–23:59 births roll the civil day forward (next day's Tý hour).
- Compatibility element interaction uses **nạp âm bản mệnh** (60-cycle
  destiny element), not the raw stem element.
- Tử Vi: Mệnh anchor → palace stem (ngũ hổ độn) → nạp âm → **Ngũ Hành Cục**
  → Tử Vi star position → both star chains. Tứ Hóa rows for Canh/Nhâm years
  follow the common Vietnamese school (variants exist; UI discloses this).
- Month pillar keys off the lunar month (v1); strict Bát Tự would use tiết
  khí (solar terms) — documented divergence, flagged in code comments.
- Leap-month births: day 1–15 → current month, 16+ → next (Tử Vi only).

## UI conventions

- **No opacity-from-zero entrance animations on chart content.** Frozen rAF
  (background tabs, reduced motion) must never leave content invisible. Hero
  medallion / reveal sequence may animate; the lá số grid/wheel must not.
- The lá số grid layout is the traditional one: Tỵ–Ngọ–Mùi–Thân across the
  top row, Dần–Sửu–Tý–Hợi across the bottom (see GRID_POS in TuViChart.tsx).
- Animal artwork lives in `src/assets/animals/` as 12 PNGs named
  `ty suu dan mao thin ti ngo mui than dau tuat hoi` (.png), picked up
  automatically by the hero medallion via a Vite glob import. Source images
  from the generator come letterboxed (1408×768 with the square artwork
  centered); center-crop to 768×768 with `sips -c 768 768 <file>` before
  dropping in a replacement, or the padding shows as bars. `.medallion` in
  `app.css` clips to a circle (`overflow: hidden` + `object-fit: cover`) so
  the artwork's own gold rim should sit flush against the container edge.

## Content status

`src/content/` holds a full AI-assisted draft (animals, elements,
relationships, fortune, star meanings) written at Justin's request, pending
his review pass for voice and cultural accuracy. Don't rewrite it wholesale
without asking; do keep his edits verbatim once he makes them. House style
for this copy: no em dashes, concrete over abstract, tradition treated
seriously but never fatalistically ("friction is information, not fate").

## Deploy

Live at https://vietnamese-zodiac.vercel.app (Vercel project `justin-nguyen/
vietnamese-zodiac`), connected to GitHub `daherro/vietnamese-zodiac` — push to
`main` auto-deploys. `vercel.json` has a catch-all rewrite to `index.html`;
without it, direct links to `/result` or `/compare` (the shareable URLs) 404
on Vercel since this is a client-side-routed SPA.

## Verify

`npx vitest run` (54 tests: lunar fixtures incl. Tết dates and leap months,
pillar boundary cases, compatibility invariants, Tử Vi placement vs canonical
tables). For UI: `npm run dev`, then walk `/result?d=1996-08-15&t=14:30&g=nam`
(full chart), `/result?d=1996-01-15` (pre-Tết boundary + no-time unlock note),
`/compare?ad=1996-08-15&bd=1990-06-10` (lục xung pair).
