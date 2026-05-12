# Panchang Page — Architecture & Developer Documentation

This document is the **authoritative reference** for the Panchang feature.
It covers the full data flow, API security, field-calculation logic, festival list, and component layout — kept in sync with the current codebase.

---

## 1. High-Level Overview

The `/panchang` page provides users with daily Hindu astrological information:

| Section | Content |
|---|---|
| Date & Tithi card | Moon phase, weekday, lunar month, current festival |
| Auspicious/Inauspicious Timings | Abhijit Muhurta, Rahu Kaal, Gulik Kaal, Yamghant Kaal |
| Sun & Moon Times | Sunrise, Sunset, Moonrise, Moonset |
| Panchang grid | 12-field table (Tithi, Nakshatra, Yoga, Karana, Month, Samvat, Sun/Moon Sign, Dishashool, etc.) |
| Upcoming Festivals | Scrollable chronological list of the next 25 Hindu events |

**Key design decision:** All external API calls happen **server-side** inside the Next.js API route (`/api/panchang`). The browser never talks to the AstroVed engine directly, so the secret token is never exposed to the client.

---

## 2. File Map

```
src/
├── app/
│   ├── panchang/
│   │   ├── page.tsx                  # Server component — renders the shell
│   │   └── layout.tsx                # Wraps with Navbar
│   └── api/
│       └── panchang/
│           └── route.ts              # Next.js API Route (server-side proxy)
├── components/
│   └── panchang/
│       └── PanchangClientPage.tsx    # Single "use client" component with all UI
└── lib/
    └── api/
        └── panchang.ts               # Fetch logic + field normalization + festival list
```

---

## 3. Data Flow (End-to-End)

```
Browser (PanchangClientPage.tsx)
  │
  │  fetch("/api/panchang?date=YYYY-MM-DD")   ← internal Next.js route
  ▼
src/app/api/panchang/route.ts
  │
  │  calls fetchPanchangData({ date })
  ▼
src/lib/api/panchang.ts
  │
  │  POST https://qaengine.astroved.com/api/v1/panchanga/comprehensive
  │  Header: Authorization: Bearer <ASTROVED_API_TOKEN>     ← from .env.local
  │
  │  normalizeApiResponse(raw)   ← maps raw API fields → UI-expected shape
  │  + calculates missing fields algorithmically
  │
  └──► returns normalized JSON to route → route returns JSON to browser
```

The client component (`PanchangClientPage.tsx`) re-fetches whenever the user changes the date using the controls bar.

---

## 4. API Security

### Token Storage

The bearer token is stored **only** in `.env.local` (which is git-ignored):

```env
# .env.local
ASTROVED_API_TOKEN=eyJhbGci...   ← access token (expires in 24h)
ASTROVED_REFRESH_TOKEN=eyJhbGci...  ← refresh token
```

### Why This Is Secure

| Layer | Detail |
|---|---|
| `.env.local` | Never committed to Git (listed in `.gitignore`) |
| `process.env.ASTROVED_API_TOKEN` | Only accessible server-side in Next.js — unavailable in browser bundles |
| Next.js API Route | Acts as a proxy; the browser calls `/api/panchang`, not the AstroVed engine |
| No `NEXT_PUBLIC_` prefix | Variables without this prefix are **never** sent to the client |

### Endpoints Used

| Scenario | Method | URL |
|---|---|---|
| Today's data (no date param) | `GET` | `https://qaengine.astroved.com/api/v2/today-panchanga?latitude=...` |
| Specific date | `POST` | `https://qaengine.astroved.com/api/v1/panchanga/comprehensive` |

Body for POST requests:
```json
{
  "datetime_local": "2026-05-05T00:00:00",
  "timezone": "Asia/Kolkata",
  "latitude": 25.3176,
  "longitude": 82.9739,
  "ayanamsa": "LAHIRI"
}
```

---

## 5. Response Normalization (`normalizeApiResponse`)

The AstroVed API uses different field names than what the UI expects (e.g., `rahu_kaal` vs `inauspiciousTimings.rahu`). The `normalizeApiResponse()` function in `panchang.ts` bridges this gap.

### Fields Mapped Directly from API

| UI Field | Raw API Field |
|---|---|
| `tithi.name` | `raw.tithi.name` |
| `tithi.endTime` | `toTime(raw.tithi.end_time)` |
| `nakshatra.name` | `raw.nakshatra.name` |
| `nakshatra.endTime` | `toTime(raw.nakshatra.end_time)` |
| `yoga.name` | `raw.yoga.name` |
| `yoga.endTime` | `toTime(raw.yoga.end_time)` |
| `karana.name` | `raw.karana.name` |
| `karana.endTime` | `toTime(raw.karana.end_time)` |
| `sun.rise` | `toTime(raw.sunrise)` |
| `sun.set` | `toTime(raw.sunset)` |
| `moon.rise` | `toTime(raw.moonrise)` |
| `moon.set` | `toTime(raw.moonset)` |
| `auspiciousTimings.abhijit.start` | `toTime(raw.abhijit_muhurta.start_time)` |
| `inauspiciousTimings.rahu.start` | `toTime(raw.rahu_kaal.start_time)` |
| `inauspiciousTimings.gulik.start` | `toTime(raw.gulika_kaal.start_time)` |
| `inauspiciousTimings.yamghant.start` | `toTime(raw.yamaganda.start_time)` |

> **`toTime(iso)`** converts an ISO-8601 datetime string (e.g., `"2026-05-05T05:19:09+05:30"`) to a human-readable time (`"5:19 am"`) using `Intl.DateTimeFormat` with `timeZone: "Asia/Kolkata"`.

### Fields Calculated Algorithmically

The AstroVed API does **not** return Sun Sign, Moon Sign, Samvat, Dishashool, Season, Ayana, or lunar month names. These are all derived from available data:

#### Moon Sign (`getMoonSign(nakshatraNumber)`)
- 27 Nakshatras are evenly distributed across 12 Rashis (2.25 per Rashi).
- Formula: `RASHI_EN[ Math.ceil(nakshatraNum / 2.25) - 1 ]`
- Example: Jyeshtha = nakshatra #18 → `ceil(18/2.25)-1 = 7` → `RASHI_EN[7]` = **Scorpio**

#### Moon Placement (`getMoonPlacement(nakshatraNumber)`)
- Nakshatras 1–14 → **NORTH** (northern declination)
- Nakshatras 15–27 → **SOUTH** (southern declination)

#### Sun Sign (`getSunSign(date)`)
- Uses a lookup table of approximate sidereal (Lahiri) Sankranti dates per year.
- Example: April 14 – May 14 → **Aries**

#### Lunar Month Names (`getLunarMonths(date, paksha)`)
- Maps the Gregorian solar month index to the approximate Amanta lunar month.
- `purnimanta` = one month ahead of `amanta`.
- Example: Solar April (index 3) → Amanta = **Vaishakh**, Purnimanta = **Jyeshtha**

#### Vikram & Shaka Samvat (`getSamvat(date)`)
- **Vikram Samvat** = Gregorian year + 57 (after April, i.e., after Hindu New Year)
- **Shaka Samvat** = Gregorian year − 78 (after April)
- Both names use the 60-year Jovian cycle (Brihaspati Samvatsara):
  `SAMVATSARA[(year - 1) % 60]`
- Example: 2026 + 57 = **2083 (Saumya)**

#### Dishashool (`DISHASHOOL_MAP[weekday]`)
- Prohibited travel direction by weekday (from raw API's `weekday` string):

| Weekday | Dishashool |
|---|---|
| Sunday | West |
| Monday | East |
| Tuesday | North |
| Wednesday | North |
| Thursday | South |
| Friday | West |
| Saturday | East |

#### Season / Ritu (`getSeason(date)`)

| Season | Approximate Dates |
|---|---|
| Vasant (Spring) | Mar 15 – May 14 |
| Grishma (Summer) | May 15 – Jul 16 |
| Varsha (Monsoon) | Jul 17 – Sep 16 |
| Sharad (Autumn) | Sep 17 – Nov 16 |
| Hemant (Pre-Winter) | Nov 17 – Jan 13 |
| Shishir (Winter) | Jan 14 – Mar 14 |

#### Ayana (`getAyana(date)`)
- **Uttarayana**: Jan 14 – Jul 16 (sun moves northward)
- **Dakshinayana**: Jul 17 – Jan 13 (sun moves southward)

---

## 6. Upcoming Festivals

### Why a Static List?

The AstroVed API does not return an `upcomingFestivals` array for the `/comprehensive` endpoint (it returns `[]`). To populate the Upcoming Festivals panel, a curated list of **95+ Hindu festivals for 2026–2027** is embedded in `panchang.ts`.

### How It Works

```ts
function getUpcomingFestivals(fromDate?: string): Array<{ date: string; name: string }>
```

1. Takes the currently selected date (e.g., `"2026-05-05"`) as `fromDate`.
2. Filters `HINDU_FESTIVALS` to include only entries **on or after** `fromDate`.
3. Returns the first **25** matches, formatted as `{ date: "5 May 2026", name: "..." }`.
4. When the user navigates to a future date, the list automatically adjusts.

### Priority Logic

```ts
upcomingFestivals: (raw.upcomingFestivals?.length || raw.upcoming_festivals?.length)
  ? (raw.upcomingFestivals ?? raw.upcoming_festivals)   // use API if available
  : getUpcomingFestivals(queryDate),                     // else use curated list
```

If the API ever starts returning festivals, they take priority automatically.

---

## 7. Fallback / Error Handling

| Scenario | Behaviour |
|---|---|
| API returns `401 Unauthorized` | Logs a warning, falls back to `getDummyPanchangData()` |
| Network error / timeout | `catch` block falls back to `getDummyPanchangData()` |
| Token missing from `.env.local` | API call is made without `Authorization` header; likely gets `401` → fallback |
| API returns `200` but empty festivals | `getUpcomingFestivals()` curated list is used |

`getDummyPanchangData()` returns a fully-shaped object using the same calculation helpers (`getSunSign`, `getMoonSign`, `getSamvat`, etc.) so even the fallback data looks realistic and date-accurate.

---

## 8. Component Architecture

All UI lives in a single `"use client"` component to avoid Suspense boundary complexity:

### `PanchangClientPage.tsx`

**State:**
```ts
const [selectedDate, setSelectedDate] = useState(queryDate || getTodayStr());
const [data, setData]                 = useState(getFallbackData(selectedDate));
const [loading, setLoading]           = useState(true);
```

**On date change:**
```ts
useEffect(() => {
  fetch(`/api/panchang?date=${selectedDate}`)
    .then(r => r.json())
    .then(json => setData(json))
    .catch(() => setData(getFallbackData(selectedDate)));
}, [selectedDate]);
```

**Layout (3-column grid on desktop):**

```
┌─────────────────┬──────────────────────────────┬──────────────┐
│  Column 1       │  Column 2                    │  Column 3    │
│                 │                              │              │
│  Date card      │  Panchang 12-field grid      │  Upcoming    │
│  (Tithi,        │  (Tithi, Nakshatra, Yoga,    │  Festivals   │
│   Festival)     │   Karana, Month, Samvat,     │  (scrollable)│
│                 │   Sun Sign, Moon Sign,       │              │
│  Auspicious /   │   Dishashool, Placement)     │              │
│  Inauspicious   │                              │              │
│  Timings        │                              │              │
│                 │                              │              │
│  Sun & Moon     │                              │              │
│  Times          │                              │              │
└─────────────────┴──────────────────────────────┴──────────────┘
```

**Date Navigation Controls (sticky bar):**
- `Today` / `Tomorrow` quick buttons (highlighted in orange when active)
- `◄` / `►` arrows to step one day at a time
- Transparent date input overlaid on the formatted date display (native date picker)
- Location dropdown (Varanasi, New Delhi, Mumbai, Chennai)

---

## 9. Environment Setup

To run the Panchang page with live data, add the following to `.env.local` in the project root:

```env
# AstroVed API — server-side only, never sent to the browser
ASTROVED_API_TOKEN=<your_access_token>
ASTROVED_REFRESH_TOKEN=<your_refresh_token>
```

> **Note:** The access token expires in 24 hours (`expires_in: 86400`). When it expires, requests will return `401` and the page will fall back to dummy data automatically. Refresh the token using the refresh endpoint and update `.env.local`.

Without the token the page still renders correctly using the calculated fallback data — no UI changes are needed.

---

## 10. Quick Reference: Key Functions in `panchang.ts`

| Function | Purpose |
|---|---|
| `fetchPanchangData(params)` | Main export — fetches from AstroVed API, normalizes, returns |
| `normalizeApiResponse(raw, date)` | Maps raw API fields → UI-expected shape + computes missing fields |
| `toTime(isoString)` | ISO datetime → readable IST time string (`"5:19 am"`) |
| `getMoonSign(nakshatraNum)` | Nakshatra number → Rashi name |
| `getMoonPlacement(nakshatraNum)` | Returns `"NORTH"` or `"SOUTH"` |
| `getSunSign(date)` | Date → sidereal Sun sign (Lahiri) |
| `getLunarMonths(date, paksha)` | Date → `{ amanta, purnimanta }` lunar month names |
| `getSamvat(date)` | Date → `{ vikram, shaka }` Samvat strings with year name |
| `getSeason(date)` | Date → Hindu Ritu season name |
| `getAyana(date)` | Date → `"Uttarayana"` or `"Dakshinayana"` |
| `getUpcomingFestivals(fromDate)` | Returns next 25 festivals from the given date |
| `getDummyPanchangData(date)` | Fallback data when API is unavailable |
| `DISHASHOOL_MAP` | Weekday → inauspicious direction lookup table |
| `HINDU_FESTIVALS` | Curated array of 95+ festivals (2026–2027) |
