"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Puja {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  badge?: string;
  shortTitle?: string;
  buttonText: string;
  location?: string;
  date?: string;
  slug?: string;
  details?: {
    benefits?: { title: string; description: string }[];
    templeLocation?: string;
  };
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ─── filter config ────────────────────────────────────────────────────────────
// Each option has a `value` (what we store) and `keywords` (matched against puja text)
const filterGroups = [
  {
    label: "Deity",
    options: [
      { value: "All", keywords: [] },
      { value: "Ganapathi", keywords: ["ganapathi", "ganesh", "ganesha", "vinayaka"] },
      { value: "Lakshmi", keywords: ["lakshmi", "laxmi"] },
      { value: "Shiva", keywords: ["shiva", "shiv", "mahadev", "shankar"] },
      { value: "Vishnu", keywords: ["vishnu", "narayan", "narayana"] },
      { value: "Hanuman", keywords: ["hanuman", "anjaneya", "maruti"] },
      { value: "Durga", keywords: ["durga", "devi", "kali", "ambika"] },
      { value: "Saraswati", keywords: ["saraswati", "saraswathi"] },
    ],
  },
  {
    label: "Tithis",
    options: [
      { value: "All", keywords: [] },
      { value: "Ekadashi", keywords: ["ekadashi"] },
      { value: "Purnima", keywords: ["purnima", "poornima", "full moon"] },
      { value: "Amavasya", keywords: ["amavasya", "new moon"] },
      { value: "Pradosh", keywords: ["pradosh", "pradosham"] },
      { value: "Navami", keywords: ["navami"] },
    ],
  },
  {
    label: "Dosha",
    options: [
      { value: "All", keywords: [] },
      { value: "Mangal Dosha", keywords: ["mangal", "manglik"] },
      { value: "Kala Sarpa", keywords: ["kala sarpa", "kalasarpa", "kalsarpa"] },
      { value: "Pitru Dosha", keywords: ["pitru", "pitra", "ancestor"] },
      { value: "Shani Dosha", keywords: ["shani", "saturn", "sade sati"] },
    ],
  },
  {
    label: "Benefits",
    options: [
      { value: "All", keywords: [] },
      { value: "Prosperity", keywords: ["prosperity", "wealth", "financial", "money", "abundance", "lakshmi"] },
      { value: "Protection", keywords: ["protection", "shield", "guard", "safety"] },
      { value: "Peace", keywords: ["peace", "shanti", "calm", "harmony"] },
      { value: "Health", keywords: ["health", "healing", "disease", "wellness"] },
      { value: "Career", keywords: ["career", "job", "business", "success", "growth"] },
      { value: "Marriage", keywords: ["marriage", "wedding", "vivah", "spouse"] },
    ],
  },
  {
    label: "Location",
    options: [
      { value: "All", keywords: [] },
      { value: "Tamil Nadu", keywords: ["tamil nadu", "tamilnadu"] },
      { value: "Karnataka", keywords: ["karnataka", "bangalore", "bengaluru", "mysore"] },
      { value: "Kerala", keywords: ["kerala"] },
      { value: "Uttar Pradesh", keywords: ["uttar pradesh", "varanasi", "kashi", "mathura", "vrindavan", "ujjain"] },
      { value: "Andhra Pradesh", keywords: ["andhra", "tirupati", "hyderabad"] },
      { value: "Rajasthan", keywords: ["rajasthan", "jaipur", "pushkar"] },
    ],
  },
];

type FilterState = Record<string, string>; // label → selected value ("All" means no filter)

const defaultFilters: FilterState = {
  Deity: "All",
  Tithis: "All",
  Dosha: "All",
  Benefits: "All",
  Location: "All",
};

/** Returns true if the puja matches ALL active filters */
function pujaMatchesFilters(puja: Puja, filters: FilterState): boolean {
  const searchText = [
    puja.title,
    puja.subtitle,
    puja.description,
    puja.location,
    puja.badge,
    ...(puja.details?.benefits?.map((b) => `${b.title} ${b.description}`) ?? []),
    puja.details?.templeLocation,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const group of filterGroups) {
    const selected = filters[group.label];
    if (!selected || selected === "All") continue;

    const optionConfig = group.options.find((o) => o.value === selected);
    if (!optionConfig || optionConfig.keywords.length === 0) continue;

    const matches = optionConfig.keywords.some((kw) => searchText.includes(kw));
    if (!matches) return false;
  }
  return true;
}

// ─── FilterChip component ─────────────────────────────────────────────────────
function FilterChip({
  group,
  selected,
  onSelect,
}: {
  group: (typeof filterGroups)[number];
  selected: string;
  onSelect: (label: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = selected !== "All";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 whitespace-nowrap select-none
          ${
            isActive
              ? "border-[#6969fa] bg-[#6969fa]/10 text-[#6969fa]"
              : "border-gray-300 bg-white text-gray-600 hover:border-[#6969fa]/60 hover:text-[#6969fa]"
          }`}
      >
        <span>{isActive ? selected : group.label}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 min-w-[170px] rounded-xl border border-gray-100 bg-white py-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
          {group.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSelect(group.label, opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#f5f5ff]
                ${selected === opt.value ? "font-semibold text-[#6969fa]" : "text-gray-700"}`}
            >
              {opt.value === "All" ? `All ${group.label}` : opt.value}
              {selected === opt.value && (
                <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-[#6969fa]">
                  <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PujaPage() {
  const [allPujas, setAllPujas] = useState<Puja[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  const [reviewScrollPos, setReviewScrollPos] = useState(0);

  const handleReviewScroll = (direction: 'left' | 'right') => {
    if (reviewsScrollRef.current) {
      const scrollAmount = 350;
      reviewsScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollEvent = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScrollLeft = target.scrollWidth - target.clientWidth;
    if (maxScrollLeft > 0) {
      setReviewScrollPos(target.scrollLeft / maxScrollLeft);
    }
  };

  // Fetch all pujas once
  useEffect(() => {
    fetch("/api/puja")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Puja[]) => setAllPujas(Array.isArray(data) ? data : []))
      .catch(() => setAllPujas([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Banner auto-rotate
  useEffect(() => {
    if (allPujas.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev === allPujas.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(id);
  }, [allPujas.length]);

  const activeIndex = allPujas.length === 0 ? 0 : Math.min(currentIndex, allPujas.length - 1);

  const handleFilterSelect = useCallback((label: string, value: string) => {
    setFilters((prev) => ({ ...prev, [label]: value }));
  }, []);

  const clearFilters = () => setFilters(defaultFilters);

  const hasActiveFilters = Object.entries(filters).some(([, v]) => v !== "All");

  // ── Apply filters to get displayed pujas ──
  const displayedPujas = allPujas.filter((p) => pujaMatchesFilters(p, filters));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9f9ff] py-10">
        <div className="mx-auto max-w-6xl px-6">

          {/* Page Heading */}
          <h1 className="mb-8 text-center text-3xl font-bold leading-tight text-[#2c1c4e] md:text-4xl">
            Perform Puja as Per Vedic Rituals at Famous Hindu Temples in India
          </h1>

          {/* Banner Carousel */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-[#e3d9f8]/40">
              <p className="text-base text-[#6e5f8f]">Loading pujas...</p>
            </div>
          ) : allPujas.length > 0 ? (
            <>
              <div className="relative overflow-hidden rounded-2xl border border-[#e3d9f8] shadow-[0_18px_48px_rgba(80,44,150,0.12)]">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                  >
                    {allPujas.map((puja) => (
                      <div key={puja._id} className="relative h-72 w-full shrink-0 md:h-96">
                        <img src={puja.imageUrl} alt={puja.title} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                        <div className="absolute inset-0 flex flex-col items-start justify-end gap-4 p-6 md:p-10">
                          <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white drop-shadow-lg md:text-4xl">
                            {puja.title}
                          </h2>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentIndex((p) => (p === 0 ? allPujas.length - 1 : p - 1))}
                  aria-label="Previous slide"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/50"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                    <path d="m12.5 4.5-5 5 5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((p) => (p === allPujas.length - 1 ? 0 : p + 1))}
                  aria-label="Next slide"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/50"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                    <path d="m7.5 4.5 5 5-5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Dots */}
              <div className="mt-4 flex justify-center gap-2">
                {allPujas.map((puja, index) => (
                  <button
                    key={puja._id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to puja ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex ? "w-8 bg-[#6969fa]" : "w-2 bg-[#d7cbef]"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}

          {/* Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-[#2c1c4e] md:text-3xl">
              Upcoming Pujas — Globally
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6e5f8f] md:text-base">
              Explore sacred rituals, discover temple offerings, and find the right puja for your spiritual needs.
            </p>

            {/* ── Filter bar ── */}
            <div className="mt-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {/* Filter icon label */}
                <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-500">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Filter
                </div>

                <div className="h-6 w-px shrink-0 bg-gray-200" />

                {/* Chip filters */}
                {filterGroups.map((group) => (
                  <FilterChip
                    key={group.label}
                    group={group}
                    selected={filters[group.label]}
                    onSelect={handleFilterSelect}
                  />
                ))}

                {/* Clear all */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-100"
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Clear all
                  </button>
                )}
              </div>

              {/* Active filter tags */}
              {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Active:</span>
                  {Object.entries(filters)
                    .filter(([, v]) => v !== "All")
                    .map(([key, val]) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#6969fa]/10 px-3 py-1 text-xs font-semibold text-[#6969fa]"
                      >
                        {key}: {val}
                        <button
                          type="button"
                          onClick={() => setFilters((p) => ({ ...p, [key]: "All" }))}
                          aria-label={`Remove ${key} filter`}
                          className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
                        >
                          <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Result count */}
            {!isLoading && (
              <p className="mt-4 text-sm text-[#6e5f8f]">
                {hasActiveFilters
                  ? `Showing ${displayedPujas.length} of ${allPujas.length} pujas`
                  : `${allPujas.length} pujas available`}
              </p>
            )}

            {/* ── Puja Cards ── */}
            {isLoading ? null : displayedPujas.length === 0 ? (
              <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#c4b8ef] bg-white py-16 text-center">
                <span className="text-4xl">🙏</span>
                <p className="text-lg font-semibold text-[#2c1c4e]">No pujas match your filters</p>
                <p className="text-sm text-[#6e5f8f]">Try adjusting or clearing the filters above</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-2 rounded-full bg-[#6969fa] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#5555e8] transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayedPujas.map((puja) => (
                  <div
                    key={puja._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-[0_16px_36px_rgba(105,105,250,0.14)]"
                  >
                    {/* Image */}
                    <div className="relative h-52 w-full overflow-hidden">
                      <img
                        src={puja.imageUrl}
                        alt={puja.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {puja.badge && (
                        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#fcd34d]/90 px-3 py-1 backdrop-blur-sm">
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-700" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950">
                            {puja.badge}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-x-4 bottom-4">
                        <h4 className="text-base font-bold leading-tight text-white drop-shadow-md lg:text-lg">
                          {puja.shortTitle || puja.title}
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#a855f7]">
                        {puja.subtitle || "UPCOMING SACRED RITUAL"}
                      </p>

                      <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-[#2c1c4e]">
                        {puja.title}
                      </h3>

                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#6e5f8f]">
                        {puja.description || "Join us for this sacred ritual to seek divine blessings."}
                      </p>

                      <div className="mt-auto space-y-2 border-t border-gray-50 pt-3">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 shrink-0 text-[#6969fa]" />
                          <span className="text-xs font-medium text-[#6e5f8f]">
                            {puja.location || "Vedic Ritual Center"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 shrink-0 text-[#6969fa]" />
                          <span className="text-xs font-medium text-[#6e5f8f]">
                            {puja.date || "Announced Soon"}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/puja/${puja.slug || slugify(puja.title)}`}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6969fa] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(105,105,250,0.35)] transition-all hover:bg-[#5555e8] hover:shadow-[0_6px_20px_rgba(105,105,250,0.45)] active:scale-[0.98]"
                      >
                        {puja.buttonText || "Book Puja"}
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Reviews ── */}
          <section className="mt-20 border-t border-gray-100 pt-16 pb-16">
            <h2 className="text-2xl font-bold text-[#1f1f1f] md:text-3xl">What devotees Say about AstroVed Puja ?</h2>
            <p className="mt-2 mb-8 text-sm text-gray-600 md:text-base">Reviews and Ratings from our customers who performed online Puja with us.</p>
            <div 
              ref={reviewsScrollRef}
              onScroll={handleScrollEvent}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
            >
              {/* Video Review Card */}
              <div className="shrink-0 w-[300px] md:w-[340px] snap-start overflow-hidden rounded-2xl bg-black">
                <div className="relative h-48 w-full bg-gray-900">
                  <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80" alt="Video thumbnail" className="h-full w-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm cursor-pointer hover:bg-black/80 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 ml-1"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=nair" alt="Achutam" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 object-cover" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">Achutam Nair</p>
                      <p className="text-xs text-gray-500">Bangalore</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Text Review 1 */}
              <div className="shrink-0 w-[300px] md:w-[340px] snap-start flex flex-col rounded-2xl bg-[#f5f5f5] p-6 shadow-sm border border-gray-100">
                <p className="flex-1 text-sm italic leading-relaxed text-gray-700">"So many puja options for all the devotees. Great to get the grace of god from our homes. Most authentic and trustworthy puja service compared to others."</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=ramesh" alt="Ramesh" className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Ramesh Chandra Bhatt</p>
                    <p className="text-xs text-gray-500">Nagpur</p>
                  </div>
                </div>
              </div>
              {/* Text Review 2 */}
              <div className="shrink-0 w-[300px] md:w-[340px] snap-start flex flex-col rounded-2xl bg-[#f5f5f5] p-6 shadow-sm border border-gray-100">
                <p className="flex-1 text-sm italic leading-relaxed text-gray-700">"I really like the whole process of puja at AstroVed. Puja is conducted properly and customer support is available throughout the process. I asked questions... Most genuine and authentic."</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=aperna" alt="Aperna" className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Aperna Mal</p>
                    <p className="text-xs text-gray-500">Puri</p>
                  </div>
                </div>
              </div>
              {/* Text Review 3 */}
              <div className="shrink-0 w-[300px] md:w-[340px] snap-start flex flex-col rounded-2xl bg-[#f5f5f5] p-6 shadow-sm border border-gray-100">
                <p className="flex-1 text-sm italic leading-relaxed text-gray-700">"Liked the fact that we can book puja online else we have to travel to get everything done. Felt very nice to hear my name and gotra during the puja of Mahadev. Prasad was also received in time."</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=shivraj" alt="Shivraj" className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Shivraj Dobhi</p>
                    <p className="text-xs text-gray-500">Agra</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button 
                onClick={() => handleReviewScroll('left')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white hover:bg-gray-400 transition"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
              </button>
              
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full transition-colors ${reviewScrollPos < 0.5 ? 'bg-[#f47820]' : 'bg-gray-300'}`} />
                <div className={`h-2 w-2 rounded-full transition-colors ${reviewScrollPos >= 0.5 ? 'bg-[#f47820]' : 'bg-gray-300'}`} />
              </div>

              <button 
                onClick={() => handleReviewScroll('right')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f47820] text-white hover:bg-[#d96619] transition shadow-md"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </section>

          {/* ── Stats Section ── */}
          <section className="mt-20">
            <h2 className="mb-2 text-2xl font-bold text-[#1f1f1f] md:text-3xl">
              Start your Sacred Journey with AstroVed Puja Service
            </h2>
            <p className="mb-8 text-sm text-gray-600">Why book AstroVed Online Puja?</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] p-8 text-center shadow-sm border border-[#bfdbfe]/50">
                <h3 className="text-2xl font-black text-[#1d4ed8]">10,00,000 +</h3>
                <p className="mt-1 text-sm font-semibold text-[#2563eb]">Puja's Done</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff] p-8 text-center shadow-sm border border-[#e9d5ff]/50">
                <h3 className="text-2xl font-black text-[#6969fa]">300,000 +</h3>
                <p className="mt-1 text-sm font-semibold text-[#6969fa]/80">Happy Devotees</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3] p-8 text-center shadow-sm border border-[#fbcfe8]/50">
                <h3 className="text-2xl font-black text-[#be185d]">100 +</h3>
                <p className="mt-1 text-sm font-semibold text-[#db2777]">Famous Temples in India</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] p-8 text-center shadow-sm border border-[#fed7aa]/50">
                <h3 className="text-2xl font-black text-[#f47820]">1 Sankalp</h3>
                <p className="mt-1 text-sm font-semibold text-[#f47820]/80">Spreading Sanatan Dharma</p>
              </div>
            </div>
          </section>

          {/* ── How it works ── */}
          <section id="how-it-works" className="mt-20">
            <h2 className="mb-8 border-b border-gray-200 pb-4 text-2xl font-bold text-[#1f1f1f] md:text-3xl">
              How does AstroVed Online Puja Works?
            </h2>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Choose Your Puja</h3>
                    <p className="mt-1 text-sm text-gray-600">Select your Puja from the list.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Your Information</h3>
                    <p className="mt-1 text-sm text-gray-600">After selecting the Puja, fill in the information of your Name and Gotra in the provided form.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Puja video</h3>
                    <p className="mt-1 text-sm text-gray-600">The video of your Puja completed with your name and Gotra will be shared on WhatsApp.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">4</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Aashirwad Box</h3>
                    <p className="mt-1 text-sm text-gray-600">Aashirwad Box will be sent to your registered address.</p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-[32px] bg-[#f47820] p-8 shadow-xl">
                <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80" alt="How it works" className="mx-auto w-full max-w-sm rounded-xl object-cover shadow-2xl h-80" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
