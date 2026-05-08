"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";
import { ReviewsSection } from "@/app/dashboard/page";

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
          ${isActive
            ? "border-[#7c3aed] bg-[#7c3aed]/10 text-[#7c3aed]"
            : "border-gray-300 bg-white text-gray-600 hover:border-[#7c3aed]/60 hover:text-[#7c3aed]"
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
                ${selected === opt.value ? "font-semibold text-[#7c3aed]" : "text-gray-700"}`}
            >
              {opt.value === "All" ? `All ${group.label}` : opt.value}
              {selected === opt.value && (
                <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-[#7c3aed]">
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
  const { t } = useTranslation();
  const [allPujas, setAllPujas] = useState<Puja[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

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
        <div className="mx-auto max-w-7xl px-4 md:px-8">

          {/* Page Heading */}
          <h1 className="mb-8 text-center text-3xl font-bold leading-tight text-[#3b0764] md:text-4xl">
            {t.puja.heading}
          </h1>

          {/* Banner Carousel */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-[#e3d9f8]/40">
              <p className="text-base text-[#7c3aed]">{t.puja.loading}</p>
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
                    className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "w-8 bg-[#7c3aed]" : "w-2 bg-[#d7cbef]"
                      }`}
                  />
                ))}
              </div>
            </>
          ) : null}

          {/* Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-[#3b0764] md:text-3xl">
              {t.puja.sectionTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#7c3aed] md:text-base">
              {t.puja.sectionSubtitle}
            </p>

            {/* ── Filter bar ── */}
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2 pb-1">
                {/* Filter icon label */}
                <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-500">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  {t.puja.filter}
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
                    {t.puja.clearAll}
                  </button>
                )}
              </div>

              {/* Active filter tags */}
              {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t.puja.active}</span>
                  {Object.entries(filters)
                    .filter(([, v]) => v !== "All")
                    .map(([key, val]) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#7c3aed]/10 px-3 py-1 text-xs font-semibold text-[#7c3aed]"
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
              <p className="mt-4 text-sm text-[#7c3aed]">
                {hasActiveFilters
                  ? `${t.puja.showingPujas} ${displayedPujas.length} ${t.puja.of} ${allPujas.length} ${t.puja.pujas}`
                  : `${allPujas.length} ${t.puja.allPujas}`}
              </p>
            )}

            {/* ── Puja Cards ── */}
            {isLoading ? null : displayedPujas.length === 0 ? (
              <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#c4b8ef] bg-white py-16 text-center">
                <span className="text-4xl">🙏</span>
                <p className="text-lg font-semibold text-[#3b0764]">{t.puja.noMatch}</p>
                <p className="text-sm text-[#7c3aed]">{t.puja.noMatchSub}</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-2 rounded-full bg-[#7c3aed] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#5555e8] transition"
                >
                  {t.puja.clearFilters}
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
                {displayedPujas.map((puja) => (
                  <div
                    key={puja._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-5"
                  >
                    {/* Image Section */}
                    <div className="relative h-[220px] w-full rounded-xl overflow-hidden shrink-0">
                      <img
                        src={puja.imageUrl || "https://images.unsplash.com/photo-1601024445121-e5b82f020549?auto=format&fit=crop&w=800&q=80"}
                        alt={puja.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Top Left Badge */}
                      <div className="absolute top-3 left-3 bg-[#ffc107] text-[#1f1f1f] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                        {puja.badge || "Special"}
                      </div>
                      {/* Bottom Left Badge */}
                      <div className="absolute bottom-3 left-3 bg-[#7c3aed] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
                        BOOK PUJA
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="pt-5 pb-1 px-1 flex flex-col flex-1 text-left">
                      <p className="text-[#d81b60] text-[11px] font-bold uppercase tracking-widest mb-3 text-center w-full">
                        {puja.subtitle || "SPECIAL PUJA & YAGYA"}
                      </p>
                      <h3 className="text-[18px] font-bold text-[#1f1f1f] mb-3 leading-snug">
                        {puja.title}
                      </h3>
                      <p className="text-gray-500 text-[14px] leading-relaxed line-clamp-2 mb-6 flex-1">
                        {puja.description || "Join us for this sacred ritual to seek divine blessings."}
                      </p>
                      
                      {/* Location & Date */}
                      <div className="flex items-start gap-2.5 mb-3 text-[13px] text-gray-500">
                        <svg className="w-[16px] h-[16px] text-[#a78bfa] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        <span className="line-clamp-2 leading-tight">{(puja as any).location || "Sacred Temple, India"}</span>
                      </div>
                      <div className="flex items-start gap-2.5 mb-6 text-[13px] text-gray-500">
                        <svg className="w-[16px] h-[16px] text-[#a78bfa] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <span className="leading-tight">{(puja as any).date || t.puja.announcedSoon}</span>
                      </div>

                      <Link href={`/puja/${puja.slug || slugify(puja.title)}`} className="w-full bg-[#7c3aed] text-white text-[15px] font-bold tracking-wide py-3.5 rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-1.5">
                        {puja.buttonText || t.puja.bookNow}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Reviews ── */}
          <section className="mt-20 border-t border-gray-100 pt-16 pb-16">
            <h2 className="text-2xl font-bold text-[#1f1f1f] md:text-3xl">{t.puja.devoteesTitle}</h2>
            <p className="mt-2 mb-8 text-sm text-gray-600 md:text-base">{t.puja.devoteesSubtitle}</p>
            <ReviewsSection />
          </section>

          {/* ── Stats Section ── */}
          <section className="mt-20">
            <h2 className="mb-2 text-2xl font-bold text-[#1f1f1f] md:text-3xl">
              {t.puja.sacredJourney}
            </h2>
            <p className="mb-8 text-sm text-gray-600">{t.puja.whyBook}</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] p-8 text-center shadow-sm border border-[#bfdbfe]/50">
                <h3 className="text-2xl font-black text-[#1d4ed8]">10,00,000 +</h3>
                <p className="mt-1 text-sm font-semibold text-[#2563eb]">{t.puja.pujasDone}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff] p-8 text-center shadow-sm border border-[#e9d5ff]/50">
                <h3 className="text-2xl font-black text-[#7c3aed]">300,000 +</h3>
                <p className="mt-1 text-sm font-semibold text-[#7c3aed]/80">{t.puja.happyDevotees}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3] p-8 text-center shadow-sm border border-[#fbcfe8]/50">
                <h3 className="text-2xl font-black text-[#be185d]">100 +</h3>
                <p className="mt-1 text-sm font-semibold text-[#db2777]">{t.puja.famousTemples}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] p-8 text-center shadow-sm border border-[#fed7aa]/50">
                <h3 className="text-2xl font-black text-[#7c3aed]">{t.puja.sankalp}</h3>
                <p className="mt-1 text-sm font-semibold text-[#7c3aed]/80">{t.puja.sankalpDesc}</p>
              </div>
            </div>
          </section>

          {/* ── How it works ── */}
          <section id="how-it-works" className="mt-20">
            <h2 className="mb-8 border-b border-gray-200 pb-4 text-2xl font-bold text-[#1f1f1f] md:text-3xl">
              {t.puja.howItWorks}
            </h2>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#7c3aed] text-sm font-bold text-white shadow-sm">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{t.puja.step1Title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t.puja.step1Desc}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#7c3aed] text-sm font-bold text-white shadow-sm">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{t.puja.step2Title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t.puja.step2Desc}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#7c3aed] text-sm font-bold text-white shadow-sm">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{t.puja.step3Title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t.puja.step3Desc}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#7c3aed] text-sm font-bold text-white shadow-sm">4</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{t.puja.step4Title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t.puja.step4Desc}</p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-[32px] bg-[#7c3aed] p-8 shadow-xl">
                <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80" alt="How it works" className="mx-auto w-full max-w-sm rounded-xl object-cover shadow-2xl h-80" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
