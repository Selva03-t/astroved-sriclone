"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";

// --- Types --------------------------------------------------------------------
export interface FAQItem {
  q: string;
  a: string;
}

export interface AstroPageLayoutProps {
  /** Breadcrumb last label */
  breadcrumb: string;
  /** Hero title text */
  heroTitle: string;
  /** Page SEO subtitle shown above the hero banner */
  seoSubtitle: string;
  /** Left main content (form + results) */
  children: ReactNode;
  /** SEO paragraphs below the form  */
  seoSections: { heading: string; body: string }[];
  /** FAQ items */
  faqs: FAQItem[];
  /** href of the current calculator — excluded from Popular Calculators sidebar */
  currentHref: string;
}

// --- Sidebar data -------------------------------------------------------------
const ARTICLES = [
  { title: "Hanuman Chalisa", updated: "November 17, 2025", img: "Om" },
  { title: "Sharad Purnima Quotes & Wishes", updated: "May 19, 2025", img: "Moon" },
  { title: "Chaitra Amavasya Fast Story", updated: "April 29, 2025", img: "Pray" },
];

const POPULAR_CALCS = [
  { label: "Janma Rashi Finder", href: "/astro-tools/janma-rashi" },
  { label: "Nakshatra Finder", href: "/astro-tools/nakshatra" },
];

// --- FAQ Accordion ------------------------------------------------------------
function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-base font-semibold text-gray-800 pr-4">{item.q}</span>
            <span className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-sm font-bold">
              {open === i ? "-" : "+"}
            </span>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-base text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Sidebar ------------------------------------------------------------------
function Sidebar({ currentHref }: { currentHref: string }) {
  const filteredCalcs = POPULAR_CALCS.filter((c) => c.href !== currentHref);

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-20">
      {/* App promo card */}
      <div
        className="rounded-2xl overflow-hidden p-5 text-white"
        style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" }}
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-100 mb-1">DivineAlign App</p>
        <p className="text-xl font-extrabold leading-snug mb-4">
          One App For all your Devotional Needs
        </p>
        <a
          href="#download-app"
          className="flex items-center gap-2 bg-white text-violet-600 text-sm font-bold px-4 py-3 rounded-xl hover:bg-violet-50 active:scale-95 transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.42.07 2.4.78 3.22.8 1.22-.24 2.39-.94 3.68-.84 1.58.13 2.77.8 3.55 2.03-3.27 1.96-2.5 6.32.55 7.54-.65 1.7-1.5 3.37-3 4.33zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Download App
        </a>
      </div>

      {/* Popular articles */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Popular articles for you</h3>
          <button className="text-sm text-violet-500 font-semibold hover:underline">Read more &gt;</button>
        </div>
        <div className="flex flex-col gap-3">
          {ARTICLES.map((a) => (
            <div
              key={a.title}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-xs font-bold text-violet-700 flex-shrink-0">
                {a.img}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">{a.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">Updated on {a.updated}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Popular calculators — excludes current page */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Popular Calculators</h3>
          <Link href="/astro-tools" className="text-sm text-violet-500 font-semibold hover:underline">See More &gt;</Link>
        </div>
        <div className="flex flex-col gap-2">
          {filteredCalcs.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50 transition-all duration-200 group"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-violet-700">{c.label}</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

// --- Main Layout --------------------------------------------------------------
export default function AstroPageLayout({
  breadcrumb,
  heroTitle,
  seoSubtitle,
  children,
  seoSections,
  faqs,
  currentHref,
}: AstroPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">

      {/* -- Breadcrumb -- */}
      <nav className="bg-[#f5f3ff] py-3.5 px-6 sticky top-[64px] z-30 border-b border-[#ddd6fe]">
        <div className="mx-auto max-w-7xl text-[14px] font-semibold text-gray-500 flex items-center gap-2.5">
          <Link href="/" className="hover:text-gray-800 transition-colors">Home</Link>
          <i className="fa-solid fa-chevron-right text-[10px] opacity-70"></i>
          <Link href="/astro-tools" className="hover:text-gray-800 transition-colors">Astrology Calculator</Link>
          <i className="fa-solid fa-chevron-right text-[10px] opacity-70"></i>
          <span className="text-[#1f1f1f] truncate max-w-[300px] font-bold">{breadcrumb}</span>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 py-6">

        {/* SEO subtitle */}
        <p className="text-base text-gray-600 mb-4 font-medium">{seoSubtitle}</p>

        {/* -- Hero Banner -- */}
        <div
          className="relative w-full rounded-3xl overflow-hidden mb-8 flex items-end"
          style={{
            minHeight: 300,
            background: "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 40%, #2d1b69 100%)",
          }}
        >
          {/* Cosmic overlay image (zodiac wheel) */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("https://imgs.search.brave.com/acCjMCO5vYOt4Fj3wdCMtAipxx5GpIeFIJ-3Grf2FcQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9uYWtz/aGF0cmEtdmVkaWMt/YXN0cm9sb2d5LWls/bHVzdHJhdGlvbi1y/YXNoaS1ncmFoYS1s/YWduYS1kYXNoYS1i/aGF2YS1yYWh1LW5h/a3NoYXRyYS12ZWRp/Yy1hc3Ryb2xvZ3kt/bmFrc2hhdHJhLXZl/ZGljLWFzdHJvbG9n/eS0zNzM5MzI2MDAu/anBn")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          {/* Title */}
          <div className="relative z-10 p-10 pb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
              {heroTitle}
            </h1>
          </div>
        </div>

        {/* -- 70/30 Layout -- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7 items-start">

          {/* -- LEFT: Form + SEO content -- */}
          <div className="flex flex-col gap-7">
            {/* Form card */}
            {children}

            {/* SEO content sections — no card wrapper, plain content */}
            <div className="px-1">
              {seoSections.map((s, i) => (
                <div key={i} className={i > 0 ? "mt-7" : ""}>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{s.heading}</h2>
                  <p className="text-base text-gray-600 leading-[1.9]">{s.body}</p>
                </div>
              ))}
            </div>

            {/* FAQ section — no card wrapper, plain content with accordion items styled individually */}
            <div className="px-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQs</h2>
              <FAQAccordion items={faqs} />
            </div>
          </div>

          {/* -- RIGHT: Sidebar -- */}
          <Sidebar currentHref={currentHref} />
        </div>
      </div>

    </div>
  );
}


