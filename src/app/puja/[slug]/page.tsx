"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { CalendarIcon, MapPinIcon, StarIcon, XMarkIcon, CheckIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

const BENEFIT_ICONS = ["🏆", "🛡️", "🌿", "💫", "❤️", "🌟", "⚡", "🎯"];
const PERSON_LABELS = ["1 Person", "2 Person", "4 Person", "6 Person"];
const PKG_NAMES = ["Individual Puja", "Partner Puja", "Family + Bhog", "Joint Family + Bhog"];
const PERSON_COLORS = [
  "bg-violet-50 text-violet-600",
  "bg-pink-50 text-pink-600",
  "bg-violet-50 text-violet-600",
  "bg-yellow-50 text-yellow-700",
];

type PujaPackage = {
  id: string;
  name: string;
  price: number;
  description: string;
};

type PujaOffering = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
};

type PujaStat = {
  label: string;
  value: string;
  detail?: string;
};

type PujaSection = {
  title: string;
  description: string;
};

type PujaFaq = {
  question: string;
  answer: string;
};

type PujaDetails = {
  heroTitle: string;
  heroSubtitle: string;
  strengthFor: string;
  ritualSummary: string;
  templeName: string;
  templeLocation: string;
  templeNote?: string;
  about: string;
  stats: PujaStat[];
  benefits: PujaSection[];
  process: PujaSection[];
  inclusions: string[];
  faq: PujaFaq[];
};

type Puja = {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  badge?: string;
  shortTitle?: string;
  location?: string;
  date?: string;
  eventDateTime?: string;
  slug: string;
  details: PujaDetails;
  packages: PujaPackage[];
  offerings: PujaOffering[];
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

const defaultCountdown: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  expired: false,
};

const parseEventDate = (value?: string) => {
  if (!value) return null;
  
  // Try DD-MM-YYYY format
  const ddmmyyyy = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(value.trim());
  if (ddmmyyyy) {
    const [, d, m, y] = ddmmyyyy;
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const normalized = value.replace(/(\d+)(st|nd|rd|th)/gi, "$1");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const buildCountdown = (target: Date): Countdown => {
  const now = Date.now();
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return { ...defaultCountdown, expired: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, expired: false };
};

export default function PujaDetailPage() {
  const params = useParams<{ slug: string }>();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const [puja, setPuja] = useState<Puja | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: "", whatsapp: "" });
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<Countdown>(defaultCountdown);
  const [activeTab, setActiveTab] = useState("about");

  const toggleExtra = (id: string) => {
    setSelectedExtraIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const extrasTotal = (puja?.offerings || [])
    .filter(o => selectedExtraIds.includes(o.id))
    .reduce((sum, o) => sum + o.price, 0);

  const selectedPackage = puja?.packages?.find((pkg) => pkg.id === selectedPackageId) ?? puja?.packages?.[0] ?? null;
  const highPrice = selectedPackage ? Math.round(selectedPackage.price * 1.2) : null;
  const totalAmount = (selectedPackage?.price || 0) + extrasTotal;

  const sectionTabs = [
    { id: "about", label: "About Puja" },
    { id: "benefits", label: "Benefits" },
    { id: "process", label: "Process" },
    { id: "temple", label: "Temple Details" },
    { id: "packages", label: "Packages" },
    { id: "reviews", label: "Reviews" },
    { id: "faqs", label: "FAQs" },
  ];

  const reviews = [
    {
      name: "Achutan Nair",
      place: "Bangalore",
      text: "Puja was conducted with proper rites and clear updates. This platform felt very genuine.",
    },
    {
      name: "Saura",
      place: "London, United Kingdom",
      text: "Great service. Easy booking and timely reminders. Felt connected throughout the ritual.",
    },
    {
      name: "Amitra",
      place: "Texas, United States",
      text: "Clear communication and authentic process. Strongly recommend for temple puja booking.",
    },
    {
      name: "Alisha",
      place: "Ontario, Canada",
      text: "Booked with trust, received puja completion updates and video as promised.",
    },
  ];

  const userReviews = [
    {
      name: "Macnish Vinay Vijay Narayan",
      date: "21 November, 2024",
      comment:
        "A blessing to connect with our mother land and temples. Safe to use and very trustworthy.",
    },
    {
      name: "Tejinder Dhillon",
      date: "19 November, 2024",
      comment:
        "Very authentic and transparent process. I feel present there while the puja is being performed.",
    },
    {
      name: "Sambit Tarafdar",
      date: "17 November, 2024",
      comment:
        "Very well conducted and satisfactory. Would like to offer prayer again in future.",
    },
  ];

  const aboutParagraphs = [
    "Become part of this sacred anushthan and invoke divine prosperity, abundance, and lasting wellbeing for your family.",
    "This rare puja includes mantra chanting, havan, and purnahuti done in your name by experienced temple priests.",
    "When performed with devotion and sankalp, this ritual helps remove financial blocks and opens the path for growth.",
  ];

  useEffect(() => {
    const loadPuja = async () => {
      try {
        if (!slug) {
          setPuja(null);
          return;
        }

        const res = await fetch(`/api/puja?slug=${slug}`);
        if (!res.ok) {
          setPuja(null);
          return;
        }

        const data: Puja = await res.json();
        setPuja(data);
        setSelectedPackageId(data.packages?.[0]?.id ?? null);
      } catch {
        setPuja(null);
      } finally {
        setLoading(false);
      }
    };

    loadPuja();
  }, [slug]);

  useEffect(() => {
    if (!puja) {
      setCountdown(defaultCountdown);
      return;
    }

    const target = parseEventDate(puja.eventDateTime) || parseEventDate(puja.date);
    if (!target) {
      setCountdown(defaultCountdown);
      return;
    }

    setCountdown(buildCountdown(target));
    const timer = setInterval(() => {
      setCountdown(buildCountdown(target));
    }, 1000);

    return () => clearInterval(timer);
  }, [puja]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["about", "benefits", "process", "temple", "packages", "reviews", "faqs"];
      const scrollPosition = window.scrollY + 150; // offset for sticky headers

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pb-24">
        {loading ? (
          <div className="mx-auto max-w-6xl px-6 py-20 text-center text-[#7c3aed]">Loading puja details...</div>
        ) : !puja ? (
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h1 className="text-3xl font-bold text-[#3b0764]">Puja not found</h1>
            <Link href="/puja" className="mt-6 inline-block rounded-xl bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white">
              Back to Pujas
            </Link>
          </div>
        ) : (
          <>
            {/* ── Breadcrumb (sticky below navbar) ── */}
            <nav className="bg-[#f5f3ff] py-3.5 px-6 sticky top-[64px] z-30 border-b border-[#ddd6fe]">
              <div className="mx-auto max-w-6xl text-[14px] font-semibold text-gray-500 flex items-center gap-2.5">
                <Link href="/" className="hover:text-gray-800 transition-colors">Home</Link>
                <i className="fa-solid fa-chevron-right text-[10px] opacity-70"></i>
                <Link href="/puja" className="hover:text-gray-800 transition-colors">AstroVed Puja Seva</Link>
                <i className="fa-solid fa-chevron-right text-[10px] opacity-70"></i>
                <span className="text-[#7c3aed] truncate max-w-[300px] font-bold">{puja.title}</span>
              </div>
            </nav>

            {/* ── Hero ── */}
            <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Left: Image */}
                <div className="relative overflow-hidden rounded-2xl">
                  <img src={puja.imageUrl || "https://images.unsplash.com/photo-1601024445121-e5b82f020549?auto=format&fit=crop&w=800&q=80"} alt={puja.title} className="w-full object-cover h-[350px] md:h-[450px]" />
                  
                  {/* Top Left Badge */}
                  {(puja.badge || puja.shortTitle) && (
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center rounded-lg bg-[#ffc107] px-4 py-1.5 text-[13px] font-bold text-[#1f1f1f] shadow-sm">
                        {puja.badge || puja.shortTitle || "Special"}
                      </span>
                    </div>
                  )}

                  {/* Swipe Button (Decorative to match screenshot) */}
                  <div className="absolute left-4 bottom-4">
                    <button className="flex items-center gap-2 rounded-full border border-white/40 bg-black/40 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                      SWIPE 
                      <svg className="h-4 w-4 rounded-full bg-white text-black p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Right: Details panel */}
                <div className="flex flex-col justify-center">
                  <p className="text-[#d81b60] text-[11px] font-bold uppercase tracking-widest mb-2">
                    {puja.subtitle || "SPECIAL PUJA & YAGYA"}
                  </p>
                  
                  <h1 className="text-[22px] md:text-[26px] font-bold leading-snug text-[#1f1f1f] mb-3">
                    {puja.title}
                  </h1>
                  
                  <p className="text-[15px] font-medium text-gray-600 mb-5 leading-relaxed">
                    {puja.description || "Join us for this sacred ritual to seek divine blessings."}
                  </p>

                  <div className="flex flex-col gap-2.5 mb-5">
                    <div className="flex items-start gap-2.5 text-[13px] text-gray-500 font-medium">
                      <svg className="w-[16px] h-[16px] text-[#a78bfa] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <span className="leading-tight">{puja.location || puja.details?.templeLocation || "Sacred Temple, India"}</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[13px] text-gray-500 font-medium">
                      <svg className="w-[16px] h-[16px] text-[#a78bfa] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span className="leading-tight">{puja.date || "Upcoming Auspicious Date"}</span>
                    </div>
                  </div>

                  {/* Countdown */}
                  {!countdown.expired && (
                    <div className="mb-5 border-t border-gray-100 pt-4">
                      <p className="text-[13px] font-bold text-[#1f1f1f] mb-2">Puja booking will close in :</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[22px] font-bold text-[#6d28d9]">{String(countdown.days)}</span>
                        <span className="text-[11px] font-medium text-[#6d28d9] uppercase mr-2">Day</span>
                        
                        <span className="text-[22px] font-bold text-[#6d28d9]">{String(countdown.hours)}</span>
                        <span className="text-[11px] font-medium text-[#6d28d9] uppercase mr-2">Hours</span>
                        
                        <span className="text-[22px] font-bold text-[#6d28d9]">{String(countdown.minutes)}</span>
                        <span className="text-[11px] font-medium text-[#6d28d9] uppercase mr-2">Mins</span>
                        
                        <span className="text-[22px] font-bold text-[#6d28d9]">{String(countdown.seconds)}</span>
                        <span className="text-[11px] font-medium text-[#6d28d9] uppercase">Secs</span>
                      </div>
                    </div>
                  )}
                  {countdown.expired && (
                    <p className="mb-5 rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600">
                      This puja has already been conducted.
                    </p>
                  )}

                  {/* Avatars + Devotees count */}
                  <div className="flex items-center justify-between mb-4 border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <img key={i} className="w-7 h-7 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="devotee" />
                        ))}
                      </div>
                    </div>
                    <div className="text-[12px] font-bold text-[#a78bfa]">
                      ★ 4.9 (7K+ ratings)
                    </div>
                  </div>
                  
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
                    Till now <span className="font-bold text-[#6d28d9]">3,00,000+ Devotees</span> have participated in Pujas conducted by AstroVed Puja Seva.
                  </p>

                  {/* CTA */}
                  {countdown.expired ? (
                    <button disabled className="w-full flex items-center justify-center rounded-lg bg-gray-300 py-3.5 text-[16px] font-bold text-white cursor-not-allowed">
                      Puja is Over
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPackageModal(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#7c3aed] py-3.5 text-[16px] font-bold text-white hover:bg-[#6d28d9] transition-colors"
                    >
                      Select puja package
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Section Nav Bar (sticky below breadcrumb+navbar = ~114px) ── */}
            <div className="sticky top-[114px] z-20 bg-white border-b border-gray-200 shadow-sm">
              <div className="mx-auto max-w-6xl px-4 md:px-6">
                <div className="flex items-center justify-between overflow-x-auto no-scrollbar w-full gap-4">
                  {sectionTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        const el = document.getElementById(tab.id);
                        if (el) {
                          const offset = 180;
                          const top = el.getBoundingClientRect().top + window.scrollY - offset;
                          window.scrollTo({ top, behavior: 'smooth' });
                        }
                      }}
                      className={`relative shrink-0 py-4 text-[15px] font-semibold whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'text-[#7c3aed]'
                          : 'text-gray-500 hover:text-[#7c3aed]'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#7c3aed] rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Flat Content Sections ── */}
            <div className="mx-auto max-w-6xl px-4 md:px-6 pt-10">

              {/* ── About Puja ── */}
              <section id="about" className="border-b border-gray-100 pb-10">
                <h2 className="text-[24px] font-bold text-[#1f1f1f] leading-snug">
                  🔥 {puja.details?.heroTitle || "Are enemies repeatedly troubling you or is your court case stuck? Through the special grace of Maa Bagalamukhi, perform the sacred Havan to remove obstacles and open the path to victory."}
                </h2>
                <div className="mt-6 space-y-6 text-[16px] leading-[1.9] text-gray-700">
                  <p>{puja.details.about || "In Sanatan Dharma, this puja is regarded as a divine power who can pacify negative energies and help control the influence of enemies. She holds a special place and is especially worshipped during times of conflict."}</p>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-gray-900 text-[17px] flex items-center gap-2"><span className="text-[#a78bfa]">🏯</span> Significance of Temple</p>
                    <p>Located in this sacred land, it is considered highly powerful and spiritually significant for worship. Situated along the holy river, it has long been a center of deep spiritual practices.</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-gray-900 text-[17px] flex items-center gap-2"><span className="text-[#a78bfa]">🔥</span> Significance of this Havan</p>
                    <p>The main highlight of this puja is the special havan performed. In Sanatan tradition, this symbolizes the destruction of negative energies and harmful forces. When offerings are made into the sacred fire, it represents the burning away of obstacles.</p>
                  </div>
                </div>
              </section>

              {/* ── Benefits ── */}
              <section id="benefits" className="border-b border-gray-100 py-10">
                <h2 className="text-[24px] font-bold text-[#1f1f1f]">Puja Benefits</h2>
                <div className="mt-8 grid gap-8 md:grid-cols-3">
                  {puja.details.benefits.map((b, idx) => (
                    <div key={`benefit-${idx}`} className="flex gap-4">
                      <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#ede9fe] text-[#6d28d9] text-xl">
                        {BENEFIT_ICONS[idx % BENEFIT_ICONS.length]}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1f1f1f] text-[17px]">{b.title}</h3>
                        <p className="mt-2 text-[15px] leading-[1.8] text-gray-600 line-clamp-3">{b.description}</p>
                        <button type="button" className="mt-2 text-[14px] font-semibold text-[#6d28d9] hover:text-[#5b21b6]">Read more</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Process ── */}
              <section id="process" className="border-b border-gray-100 py-10">
                <h2 className="text-[24px] font-bold text-[#1f1f1f]">Puja Process</h2>
                <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {puja.details.process.map((step, idx) => (
                    <div key={`process-${idx}`} className="flex gap-4">
                      <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded bg-[#6d28d9] text-[13px] font-bold text-white shadow-sm">{idx + 1}</div>
                      <div>
                        <h3 className="font-bold text-[#1f1f1f] text-[16px]">{step.title}</h3>
                        <p className="mt-2 text-[15px] leading-[1.8] text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Temple Details ── */}
              <section id="temple" className="border-b border-gray-100 py-10">
                <h2 className="text-[24px] font-bold text-gray-900">{puja.details.templeName}, {puja.details.templeLocation}</h2>
                <div className="mt-6 grid gap-8 md:grid-cols-[1fr_1.5fr]">
                  <img src={puja.imageUrl} alt={puja.details.templeName} className="h-64 w-full rounded-2xl object-cover shadow-sm" />
                  <div className="space-y-4 text-[16px] leading-[1.9] text-gray-700 text-justify">
                    <p>{puja.details.templeNote || "This temple is known for powerful prosperity rituals and ancient worship traditions."}</p>
                    <p>{puja.details.about}</p>
                    <p>Devotees believe prayers offered here remove obstacles, invite abundance, and support career, finance, and family harmony.</p>
                  </div>
                </div>
              </section>

              {/* ── All Packages Includes ── */}
              <section className="border-b border-gray-100 py-10">
                <h2 className="text-2xl font-bold text-gray-900">All Puja Packages includes</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {puja.details.inclusions.map((item, idx) => (
                    <div key={`incl-${idx}`} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f8f7ff] border border-[#7c3aed]/20">
                        <CheckIcon className="h-3 w-3 text-[#7c3aed]" />
                      </div>
                      <p className="text-sm leading-6 text-gray-700 font-medium">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#f5f3ff] border border-[#ddd6fe] p-4 text-[#5b21b6]">
                  <span className="text-xl">🎁</span>
                  <p className="text-sm font-semibold leading-6">Opt for additional offerings like Vastra Daan, Anna Daan, Deep Daan, or Gau Seva in your name, available on the payments page.</p>
                </div>
              </section>

              {/* ── Package Selection ── */}
              <section id="packages" className="border-b border-gray-100 py-10">
                <h2 className="text-2xl font-bold text-gray-900">Select your puja package</h2>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {puja.packages.map((pkg, idx) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    const isRecommended = idx === 2;
                    return (
                      <button
                        key={`pkg-${pkg.id}-${idx}`}
                        type="button"
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 ${
                          isSelected ? "border-[#7c3aed] shadow-[0_8px_30px_rgba(105,105,250,0.12)] -translate-y-1" : "border-gray-100 hover:border-[#7c3aed]/30 hover:shadow-md"
                        }`}
                      >
                        {isRecommended && (
                          <div className="bg-[#5b21b6] py-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-white">Recommended</div>
                        )}
                        <div className="flex flex-1 flex-col p-5">
                          {/* Person badge + radio */}
                          <div className="flex items-center justify-between">
                            <span className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold ${PERSON_COLORS[idx] ?? PERSON_COLORS[0]}`}>
                              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                                <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm-5 6a5 5 0 0110 0H3z" />
                              </svg>
                              {PERSON_LABELS[idx] ?? `${idx + 1} Person`}
                            </span>
                            <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                              isSelected ? "border-[#7c3aed] bg-[#7c3aed]" : "border-gray-300"
                            }`}>
                              {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                          {/* Name + image row */}
                          <div className="mt-4 flex items-end justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 leading-snug">{PKG_NAMES[idx] || pkg.name}</h4>
                              <div className="mt-3">
                                <p className="text-xl font-black text-[#7c3aed]">₹{pkg.price}</p>
                                <p className="text-xs font-bold text-gray-400 line-through">₹{Math.round(pkg.price * 1.2)}</p>
                              </div>
                            </div>
                            <img
                              src={puja.imageUrl}
                              alt={pkg.name}
                              className="h-20 w-20 shrink-0 rounded-xl object-cover object-top shadow-sm"
                            />
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-[#7c3aed] rotate-45 z-10"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Expanded Description Section for Selected Package */}
                {selectedPackage && (
                  <div className="mt-6 rounded-xl border border-[#ddd6fe] bg-[#f5f3ff] p-5">
                    <h4 className="text-sm font-bold text-[#5b21b6]">{PKG_NAMES[puja.packages.findIndex(p => p.id === selectedPackage.id)] || selectedPackage.name}</h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#5b21b6]" />
                        <p className="text-xs leading-5 text-gray-600">Our temple Pandit Ji recommends this package as the sacred puja invokes powerful blessings, protecting the entire family from fear, negativity, and unseen obstacles while strengthening courage and devotion.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#5b21b6]" />
                        <p className="text-xs leading-5 text-gray-600">With dedicated mantra chanting and sacred offerings, this ritual helps remove life challenges, enhance inner strength, and bless the household with stability, confidence, and peace.</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* ── Reviews ── */}
              <section id="reviews" className="border-b border-gray-100 py-10">
                <h2 className="text-2xl font-bold text-gray-900">Reviews &amp; Ratings</h2>
                <p className="mt-1.5 text-sm text-gray-500">Read what our devotees have to say about AstroVed.</p>
                <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {reviews.map((review) => (
                    <div key={review.name} className="rounded-xl border border-gray-100 p-5 shadow-sm bg-white hover:shadow-md transition-shadow">
                      <p className="text-sm leading-6 text-gray-600 italic">"{review.text}"</p>
                      <p className="mt-4 text-sm font-bold text-gray-900">{review.name}</p>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{review.place}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 divide-y divide-gray-100">
                  {userReviews.map((review) => (
                    <div key={review.name} className="py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7ff] text-sm font-bold text-[#7c3aed] border border-[#7c3aed]/20 shadow-sm">{review.name[0]}</div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{review.name}</p>
                          <p className="text-[11px] font-semibold text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-amber-400">★★★★★</p>
                      <p className="mt-2 text-sm leading-6 text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── FAQs ── */}
              <section id="faqs" className="py-10">
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <div className="mt-6 divide-y divide-gray-100">
                  {puja.details.faq.map((item, idx) => (
                    <details key={`faq-${idx}`} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-gray-900">
                        {item.question}
                        <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-500 group-open:bg-[#f8f7ff] group-open:text-[#7c3aed] group-open:border-[#7c3aed]/20 transition-colors">+</span>
                      </summary>
                      <p className="mt-3 text-sm leading-7 text-gray-600 pl-2 border-l-2 border-[#7c3aed]/20">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

            </div>
          </>
        )}

        {/* ── Sticky bottom booking bar ── */}
        {puja && !countdown.expired && (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 px-4 py-3 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#3b0764]">{selectedPackage?.name ?? "Select a package"}</p>
                <p className="text-xl font-extrabold text-[#7c3aed]">₹{selectedPackage?.price ?? "—"}</p>
              </div>
              <button
                onClick={() => setShowPackageModal(true)}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-[#7c3aed] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(105,105,250,0.4)] transition-all hover:bg-[#5555e8] active:scale-95"
              >
                Book Puja
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Package Selection Modal */}
      {showPackageModal && puja && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
           <div className="relative flex h-full max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 p-6">
                 <h2 className="text-xl font-bold text-[#1f1f1f]">All Puja Packages includes</h2>
                 <button onClick={() => setShowPackageModal(false)} className="rounded-full p-2 hover:bg-gray-100">
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                 </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                 {/* Inclusions List */}
                 <div className="space-y-4">
                    {[
                       "The participant's name and gotra will be recited by an experienced Panditji during the puja.",
                       "Participants will receive guided mantras and step-by-step instructions to join the puja from home.",
                       "A complete video of the puja and offerings will be shared on your WhatsApp.",
                       "A free Aashirwad Box with Tirth Prasad will be delivered to your home if you opt in to receive it."
                    ].map((item, idx) => (
                       <div key={idx} className="flex items-start gap-4">
                          <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[#7c3aed]" />
                          <p className="text-[14px] leading-relaxed text-[#4b5563]">{item}</p>
                       </div>
                    ))}
                 </div>

                 {/* Additional Offerings Note */}
                 <div className="mt-8 flex items-center gap-4 rounded-2xl bg-[#f0f9f4] p-4 text-[#0e8356]">
                    <div className="h-10 w-10 shrink-0 bg-[#7c3aed]/10 rounded-lg flex items-center justify-center">
                       <i className="fa-solid fa-hand-holding-dollar text-lg"></i>
                    </div>
                    <p className="text-[13px] font-medium leading-relaxed">
                       Opt for additional offerings like Vastra Daan, Anna Daan, Deep Daan, or Gau Seva in your name, available on the payments page.
                    </p>
                 </div>

                 {/* Package Selection Grid */}
                 <div className="mt-10">
                    <h3 className="text-lg font-bold text-[#1f1f1f] mb-6">Select your puja package</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                       {puja.packages.map((pkg, idx) => (
                          <button
                            key={pkg.id}
                            onClick={() => setSelectedPackageId(pkg.id)}
                            className={`relative flex flex-col p-5 rounded-3xl border-2 transition-all text-left ${
                              selectedPackageId === pkg.id 
                                ? "border-[#7c3aed] bg-[#7c3aed]/5 shadow-lg" 
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                          >
                             {idx === 2 && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#516300] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                   Recommended
                                </div>
                             )}
                             
                             <div className="mb-4 flex items-center justify-between">
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase ${
                                   idx === 0 ? "bg-violet-50 text-violet-600" : 
                                   idx === 1 ? "bg-pink-50 text-pink-600" :
                                   idx === 2 ? "bg-violet-50 text-violet-600" : "bg-yellow-50 text-yellow-600"
                                }`}>
                                   <i className="fa-solid fa-user text-[10px]"></i>
                                   {idx === 0 ? "1 Person" : idx === 1 ? "2 Person" : idx === 2 ? "4 Person" : "6 Person"}
                                </div>
                                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                   selectedPackageId === pkg.id ? "border-[#7c3aed] bg-[#7c3aed]" : "border-gray-200"
                                }`}>
                                   {selectedPackageId === pkg.id && <CheckIcon className="h-4 w-4 text-white" />}
                                </div>
                             </div>

                             <h4 className="text-base font-bold text-[#1f1f1f] mb-2">{pkg.name}</h4>
                             <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{pkg.description}</p>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Trust Bar */}
                 <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-gray-50 pt-8 pb-4">
                    {[
                       { icon: "fa-shield-halved", label: "Hidden Cost" },
                       { icon: "fa-certificate", label: "ISO 27001 Certified Company" },
                       { icon: "fa-place-of-worship", label: "Official Temple Partner" },
                       { icon: "fa-headset", label: "Customer Support" }
                    ].map((trust) => (
                       <div key={trust.label} className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                          <i className={`fa-solid ${trust.icon} text-gray-600 text-sm`}></i>
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter whitespace-nowrap">{trust.label}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="border-t border-gray-100 p-6 bg-white">
                 <button 
                   onClick={() => {
                      if (selectedPackageId) {
                         setShowPackageModal(false);
                         setShowDetailsModal(true);
                      }
                   }}
                   className="flex w-full items-center justify-between rounded-2xl bg-[#7c3aed] p-4 text-white shadow-xl shadow-[#7c3aed]/20 hover:scale-[1.01] transition-transform"
                 >
                    <div className="text-left">
                       <p className="text-xl font-bold">₹{selectedPackage?.price || '0'}</p>
                       <p className="text-[10px] font-medium uppercase opacity-80">{selectedPackage?.name}</p>
                    </div>
                    <div className="flex items-center gap-4 font-bold uppercase tracking-widest text-sm">
                       Proceed <i className="fa-solid fa-arrow-right"></i>
                    </div>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Details Collection Modal */}
      {showDetailsModal && puja && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
           <div className="relative w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                 <button 
                   onClick={() => {
                      setShowDetailsModal(false);
                      setShowPackageModal(true);
                   }}
                   className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                 >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-900" />
                 </button>
                 <h3 className="text-xl font-bold text-gray-900">Fill your details for Puja</h3>
              </div>
              
              <div className="space-y-8">
                 {/* WhatsApp Number Field */}
                 <div>
                    <label className="block text-gray-900 font-bold text-sm mb-2">Enter Your Whatsapp Mobile Number</label>
                    <p className="text-[11px] text-gray-400 mb-4 leading-relaxed font-medium">Your Puja booking updates like Puja Photos, Videos and other details will be sent on WhatsApp on below number.</p>
                    <div className="relative group">
                       <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#7c3aed] font-bold">
                          <i className="fa-brands fa-whatsapp text-lg"></i>
                          <span className="text-sm">+91</span>
                       </div>
                       <input 
                         type="tel" 
                         maxLength={10}
                         value={userDetails.whatsapp}
                         onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setUserDetails(prev => ({ ...prev, whatsapp: val }));
                         }}
                         className="w-full bg-white border-2 border-blue-500 rounded-2xl py-4 pl-24 pr-12 font-bold text-gray-900 outline-none shadow-[0_0_0_1px_rgba(59,130,246,0.1)]"
                         placeholder="8192812323"
                       />
                       {userDetails.whatsapp && (
                          <button 
                            onClick={() => setUserDetails(prev => ({ ...prev, whatsapp: "" }))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500"
                          >
                             <i className="fa-solid fa-circle-xmark opacity-50"></i>
                          </button>
                       )}
                       <div className="absolute -top-2.5 left-6 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Your mobile Number</div>
                    </div>
                 </div>

                 {/* Name Field */}
                 <div>
                    <label className="block text-gray-900 font-bold text-sm mb-4">Enter Your Name</label>
                    <div className="relative group">
                       <input 
                         type="text" 
                         value={userDetails.name}
                         onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                         className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-900 outline-none shadow-sm focus:border-blue-500 transition-all"
                         placeholder="enter your name"
                       />
                       {userDetails.name && (
                          <button 
                            onClick={() => setUserDetails(prev => ({ ...prev, name: "" }))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500"
                          >
                             <i className="fa-solid fa-circle-xmark opacity-50"></i>
                          </button>
                       )}
                       <div className="absolute -top-2 left-6 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Your full Name</div>
                    </div>
                 </div>

                 {/* Next Button */}
                 <button 
                   disabled={!userDetails.name || userDetails.whatsapp.length < 10}
                   onClick={() => {
                      setShowDetailsModal(false);
                      setShowReviewModal(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                   }}
                   className="w-full bg-[#7c3aed] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#6d28d9] transition-all disabled:opacity-50 disabled:grayscale mt-4"
                 >
                    Next
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && puja && (
        <div className="fixed inset-0 z-[120] bg-[#f8f9fa] overflow-y-auto">
           <Navbar />
           {/* Review Breadcrumbs */}
           <div className="bg-white border-b border-gray-100 py-3 px-6 sticky top-0 z-10">
              <div className="mx-auto max-w-7xl flex items-center justify-between">
                 <div className="flex items-center gap-6 text-[10px] uppercase font-bold tracking-widest text-[#7c3aed]">
                    <div className="flex items-center gap-2"><div className="h-5 w-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[8px]">1</div> Add Details</div>
                    <div className="flex items-center gap-2"><div className="h-5 w-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[8px]">2</div> Review Booking</div>
                    <div className="flex items-center gap-2 opacity-30"><div className="h-5 w-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-[8px]">3</div> Make Payment</div>
                 </div>
                 <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-red-500">
                    <XMarkIcon className="h-6 w-6" />
                 </button>
              </div>
           </div>

           <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column: Selected Items */}
              <div className="lg:col-span-2 space-y-6">
                 <button 
                   onClick={() => {
                      setShowReviewModal(false);
                      setShowDetailsModal(true);
                   }}
                   className="flex items-center gap-2 text-sm font-bold text-[#1f1f1f] hover:text-[#7c3aed] transition-colors mb-6"
                 >
                    <ArrowLeftIcon className="h-4 w-4" /> Review Booking
                 </button>

                 <div className="space-y-4">
                    {/* Primary Package */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <h3 className="font-bold text-[#1f1f1f] text-lg mb-1">{selectedPackage?.name}</h3>
                             <p className="text-[#7c3aed] font-extrabold text-xl">₹ {selectedPackage?.price}</p>
                          </div>
                          <div className="bg-[#7c3aed]/10 text-[#7c3aed] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                             Primary Package
                          </div>
                       </div>
                       <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-2 text-gray-500 text-[11px] font-bold">
                             <i className="fa-brands fa-whatsapp text-[#7c3aed] text-lg"></i>
                             <span>+91 {userDetails.whatsapp}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-[11px] font-bold">
                             <i className="fa-solid fa-user text-gray-400"></i>
                             <span>{userDetails.name}</span>
                          </div>
                       </div>
                    </div>

                    {/* Extra Selected Offerings */}
                    {(puja?.offerings || []).filter(o => selectedExtraIds.includes(o.id)).map(extra => (
                       <div key={extra.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex justify-between items-center group">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 bg-gray-50 rounded-xl overflow-hidden">
                                <img src={extra.imageUrl} alt={extra.name} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <h4 className="font-bold text-sm text-[#1f1f1f]">{extra.name}</h4>
                                <p className="text-[#7c3aed] font-bold text-sm">₹ {extra.price}</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => toggleExtra(extra.id)}
                            className="text-red-500 hover:bg-red-50 h-8 w-8 rounded-full flex items-center justify-center transition-all"
                          >
                             <XMarkIcon className="h-5 w-5" />
                          </button>
                       </div>
                    ))}
                    
                    <div className="bg-violet-50/50 rounded-2xl p-6 flex justify-between items-center cursor-pointer hover:bg-violet-50 transition-colors border border-violet-100/50">
                       <div className="flex items-center gap-3">
                          <span className="text-xl">🏷️</span>
                          <span className="font-bold text-sm text-[#1f1f1f]">Apply Coupon Code</span>
                       </div>
                       <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                       <h3 className="font-bold text-[#1f1f1f] mb-6 border-b border-gray-50 pb-4">Bill details</h3>
                       <div className="space-y-4 text-sm font-medium text-gray-500">
                          <div className="flex justify-between">
                             <span>{selectedPackage?.name}</span>
                             <span className="text-gray-900">₹ {selectedPackage?.price}.0</span>
                          </div>
                          {(puja?.offerings || []).filter(o => selectedExtraIds.includes(o.id)).map(extra => (
                             <div key={extra.id} className="flex justify-between">
                                <span>{extra.name}</span>
                                <span className="text-gray-900">₹ {extra.price}.0</span>
                             </div>
                          ))}
                          <div className="pt-6 mt-2 border-t border-gray-100 flex justify-between text-xl font-black text-[#1f1f1f]">
                             <span>Total Amount</span>
                             <span className="text-[#7c3aed]">₹ {totalAmount}.0</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Upsell */}
              <div>
                 <h3 className="font-bold text-[#1f1f1f] mb-6 flex items-center gap-2">
                    <span className="h-1.5 w-6 bg-[#7c3aed] rounded-full"></span>
                    Add more Divine offerings
                 </h3>
                 <div className="space-y-4">
                    {(puja?.offerings || []).filter(o => !selectedExtraIds.includes(o.id)).map(extra => (
                       <div key={extra.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-[#7c3aed]/30 transition-all">
                          <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                             <img src={extra.imageUrl} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="font-bold text-[13px] text-[#1f1f1f] truncate">{extra.name}</h4>
                             <p className="text-[#7c3aed] font-bold text-[13px] mt-0.5">₹ {extra.price}</p>
                          </div>
                          <button 
                            onClick={() => toggleExtra(extra.id)}
                            className="bg-white text-[#7c3aed] border border-[#7c3aed] h-8 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#7c3aed] hover:text-white transition-all active:scale-95"
                          >
                             + Add
                          </button>
                       </div>
                    ))}
                 </div>

                 <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-start gap-4">
                       <i className="fa-solid fa-circle-info text-blue-500 mt-1"></i>
                       <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
                          By proceeding, you agree to our Terms of Service. Your Puja will be conducted with full vedic rites as per the selected package and offerings.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Floating Bottom Bar */}
           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:p-6 z-50">
              <div className="mx-auto max-w-7xl flex items-center justify-between bg-[#7c3aed] text-white p-4 lg:p-5 rounded-2xl shadow-xl shadow-[#7c3aed]/20">
                 <div className="flex items-center gap-4 text-sm font-bold pl-4">
                    <span>{1 + selectedExtraIds.length} Sevas selected</span>
                    <span className="opacity-50">•</span>
                    <span className="text-lg">₹ {totalAmount}</span>
                 </div>
                 <button 
                   onClick={() => {
                      const extras = selectedExtraIds.join(',');
                      window.location.href = `/payment?amount=${totalAmount}&type=puja&pkg=${selectedPackageId}&name=${encodeURIComponent(userDetails.name)}&wa=${userDetails.whatsapp}&extras=${extras}&title=${encodeURIComponent(puja.title)}`;
                   }}
                   className="flex items-center gap-2 font-bold hover:gap-4 transition-all uppercase tracking-widest text-sm"
                 >
                    Proceed to Payment <i className="fa-solid fa-arrow-right"></i>
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
