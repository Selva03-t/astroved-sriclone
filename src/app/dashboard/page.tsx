"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { useTranslation } from "@/contexts/LanguageContext";

const navigationItems = [
  { label: "Home", path: "/dashboard" },
  { label: "Puja", path: "/puja" },
  { label: "Chadhava", path: "/chadhava" },
  { label: "Panchang", path: "/panchang" },
  { label: "Temples", path: "/temples" },
  { label: "Library", path: "/library" },
  { label: "Astro Tools", path: "/astro-tools" },
  { label: "Store", path: "/store" },
];

const banners = [
  {
    id: 1,
    title: "Offer AstroVed Puja and Chadhava at 100+ sacred temples in your Name and Gotra to your beloved deity.",
    titleHighlight: "",
    subtitle: "",
    buttons: [
      { text: "Explore Pujas", variant: "outline", href: "/puja" },
      { text: "Participate Now", variant: "solid", href: "/puja" }
    ],
    image: "/images/Ganesh-Chaturthi-Mahapuja.jpg",
    baseColor: "#5b172a",
  },
  {
    id: 2,
    title: "DivineAlign Special ",
    titleHighlight: "Puja",
    subtitle: "Invoke peace, prosperity, and happiness for your family through online pujas at India's sacred temples — from the comfort of your home.",
    buttons: [
      { text: "Book Puja", variant: "solid", href: "/puja" }
    ],
    image: "/images/Navagraha-Shanti-Puja.jpg",
    baseColor: "#1e3a5f",
  },
  {
    id: 3,
    title: "DivineAlign",
    titleHighlight: "",
    titleColor: "text-yellow-400",
    subtitle: "Experience divine blessings from sacred temples of India — enjoy online darshan, horoscope, prasad, stories, mantras, and a lot more. Exclusively on DivineAlign.",
    buttons: [
      { text: "Download App", variant: "solid", action: "scroll-bottom" }
    ],
    image: "/images/Lakshmi-Homam.jpg",
    baseColor: "#a62828",
  },
  {
    id: 4,
    title: "DivineAlign Special ",
    titleHighlight: "Chadhava",
    subtitle: "Now offer your prayers and sacred offerings to your beloved deities at renowned temples across India — from your home. Seek divine blessings on DivineAlign.",
    buttons: [
      { text: "Book Chadhava", variant: "solid", href: "/chadhava" }
    ],
    image: "/images/maa-kali.jpg",
    baseColor: "#2b1b1b",
  },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#1f1f1f]">
      <Navbar />
      <div className="h-px w-full bg-[#d5d8f5]" />

      {/* Banner Section */}
      <section className="w-full">
        <div className="relative w-full h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden group">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div 
                className="relative h-full w-full transition-colors duration-700"
                style={{ backgroundColor: banner.baseColor || "#5b172a" }}
              >
                <div className="absolute inset-y-0 right-0 w-full md:w-[65%]">
                  <Image
                    src={banner.image || "/images/placeholder.jpg"}
                    alt={banner.title}
                    fill
                    className="object-cover object-top md:object-right-top opacity-80 md:opacity-100"
                    priority={index === 0}
                  />
                </div>

                {/* Desktop merge effect (spans full width to hide the container edge) */}
                <div 
                  className="hidden md:block absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, ${banner.baseColor || "#5b172a"} 35%, transparent 65%)`
                  }}
                />

                {/* Mobile gradient overlay for legibility */}
                <div 
                  className="absolute inset-0 md:hidden"
                  style={{
                    background: `linear-gradient(to right, ${banner.baseColor || "#5b172a"} 10%, transparent 100%)`
                  }}
                />
                
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 md:max-w-[60%] text-left z-10">
                  <h2 className={`text-3xl md:text-[44px] font-bold leading-[1.15] mb-6 tracking-tight ${banner.titleColor || 'text-white'}`}>
                    {banner.title}
                    {banner.titleHighlight && (
                      <span className="text-[#ffc107]">{banner.titleHighlight}</span>
                    )}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-[16px] md:text-[18px] font-medium text-gray-200 mb-10 max-w-2xl leading-relaxed">
                      {banner.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4">
                    {banner.buttons.map((btn: any, i) => {
                      const buttonClass = `rounded-xl px-8 py-3.5 font-bold text-[15px] transition-all shadow-sm active:scale-95 ${
                        btn.variant === 'solid'
                          ? "bg-[#6869F9] text-white hover:bg-[#5657e8]"
                          : "bg-transparent border border-white text-white hover:bg-white/10"
                      }`;

                      if (btn.href) {
                        return (
                          <Link key={i} href={btn.href} className={buttonClass}>
                            {btn.text}
                          </Link>
                        );
                      }

                      if (btn.action === "scroll-bottom") {
                        return (
                          <button 
                            key={i}
                            className={buttonClass}
                            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                          >
                            {btn.text}
                          </button>
                        );
                      }

                      return (
                        <button key={i} className={buttonClass}>
                          {btn.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100"
            aria-label="Previous banner"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <button
            onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100"
            aria-label="Next banner"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6"><path d="m9 18 6-6-6-6"/></svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentBanner ? "bg-white w-8" : "bg-white/50 w-1.5 hover:bg-white/80"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-[#6869F9] py-4 md:py-5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[
            "#1 Vedic Remedies & Astrological Insights Provider",
            "25+ Years of Expertise in Vedic Astrology",
            "10M+ Homas, Poojas & Remedies Performed",
            "7M Expert Consultations",
            "60M+ lives touched",
            "#1 Vedic Remedies & Astrological Insights Provider",
            "25+ Years of Expertise in Vedic Astrology",
            "10M+ Homas, Poojas & Remedies Performed",
            "7M Expert Consultations",
            "60M+ lives touched",
            "#1 Vedic Remedies & Astrological Insights Provider",
            "25+ Years of Expertise in Vedic Astrology",
            "10M+ Homas, Poojas & Remedies Performed",
            "7M Expert Consultations",
            "60M+ lives touched",
          ].map((item, idx) => (
            <div key={idx} className="inline-flex items-center mx-12 shrink-0">
              <span className="text-yellow-300 text-lg md:text-xl mr-3.5 rotate-45 inline-block">✦</span>
              <span className="text-base md:text-[17px] text-white font-bold uppercase tracking-wide">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DivineAlign Special Pujas Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-4xl font-extrabold text-center mb-4 tracking-tight text-[#111827]">
            <span className="text-[rgb(107,76,154)]">DivineAlign</span> {t.home.specialPujas}
          </h2>
          <p className="text-center text-[17px] font-medium text-gray-700 mb-14 max-w-2xl mx-auto leading-relaxed">
            {t.home.specialPujasSubtitle}
          </p>
          <PujaCardsSection />
        </div>               
      </section>

      {/* Reviews & Ratings Section */}
      <section className="bg-[#fafafa] py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl font-extrabold text-[#111827] mb-3 tracking-tight">{t.home.reviewsTitle}</h2>
          <p className="text-[17px] font-medium text-gray-700 mb-14">{t.home.reviewsSubtitle}</p>

          <ReviewsSection />
        </div>
      </section>

      {/* Trust & Impact Section */}
      <section className="bg-[#101c3d] py-16 md:py-20 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <p className="text-[#1f1f1f] font-bold text-base mb-3">{t.home.trustedBy}</p>
              <h2 className="text-4xl lg:text-[40px] font-bold leading-tight mb-5">
                {t.home.largestPlatform}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                {t.home.platformDesc}
              </p>
            </div>

            {/* Right Column: Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
              <div className="flex flex-col gap-3.5">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🙏</div>
                <div>
                  <h3 className="text-xl font-bold mb-1.5">{t.home.devotees}</h3>
                  <p className="text-gray-400 leading-relaxed text-[15px] font-medium">{t.home.devoteesDesc}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3.5">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl text-yellow-400">★</div>
                <div>
                  <h3 className="text-xl font-bold mb-1.5">{t.home.rating}</h3>
                  <p className="text-gray-400 leading-relaxed text-[15px] font-medium">{t.home.ratingDesc}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3.5">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🌍</div>
                <div>
                  <h3 className="text-xl font-bold mb-1.5">{t.home.countries}</h3>
                  <p className="text-gray-400 leading-relaxed text-[15px] font-medium">{t.home.countriesDesc}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3.5">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🔥</div>
                <div>
                  <h3 className="text-xl font-bold mb-1.5">{t.home.services}</h3>
                  <p className="text-gray-400 leading-relaxed text-[15px] font-medium">{t.home.servicesDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-[40px] font-bold text-[#1f1f1f] mb-4">{t.home.oneApp}</h2>
            <p className="text-lg text-gray-600 max-w-5xl mx-auto leading-relaxed">
              {t.home.oneAppDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
            {/* Feature 1 */}
            <div className="flex flex-col gap-4">
              <div className="h-14 w-14 bg-[#1f2937] rounded-xl flex items-center justify-center text-2xl shadow-md">🔔</div>
              <div>
                <h3 className="text-xl font-bold text-[#1f1f1f] mb-2">{t.home.divineTemple}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{t.home.divineTempleDesc}</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-4">
              <div className="h-14 w-14 bg-[#c2410c] rounded-xl flex items-center justify-center text-2xl shadow-md">📖</div>
              <div>
                <h3 className="text-xl font-bold text-[#1f1f1f] mb-2">{t.home.hinduLiterature}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{t.home.hinduLiteratureDesc}</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-4">
              <div className="h-14 w-14 bg-[#0d9488] rounded-xl flex items-center justify-center text-2xl shadow-md">🎵</div>
              <div>
                <h3 className="text-xl font-bold text-[#1f1f1f] mb-2">{t.home.devotionalMusic}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{t.home.devotionalMusicDesc}</p>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="flex flex-col gap-4">
              <div className="h-14 w-14 bg-[#ea580c] rounded-xl flex items-center justify-center text-2xl shadow-md">✡</div>
              <div>
                <h3 className="text-xl font-bold text-[#1f1f1f] mb-2">{t.home.panchangFeature}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{t.home.panchangFeatureDesc}</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col gap-4">
              <div className="h-14 w-14 bg-[#ca8a04] rounded-xl flex items-center justify-center text-2xl shadow-md">☸</div>
              <div>
                <h3 className="text-xl font-bold text-[#1f1f1f] mb-2">{t.home.pujaService}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{t.home.pujaServiceDesc}</p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col gap-4">
              <div className="h-14 w-14 bg-[#dc2626] rounded-xl flex items-center justify-center text-2xl shadow-md">🕉</div>
              <div>
                <h3 className="text-xl font-bold text-[#1f1f1f] mb-2">{t.home.community}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{t.home.communityDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section (Exactly as in Image) */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1f1f1f] mb-4">
              {t.home.articlesTitle}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {t.home.articlesSubtitle}
            </p>
            <Link href="/library" className="inline-flex items-center text-[#1f1f1f] font-bold text-sm hover:underline">
              {t.home.readAll} <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Aarti */}
            <div className="flex flex-col">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
                <img
                  src="https://www.srimandir.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Faarti_article_image.0d882263.webp&w=1920&q=75"
                  alt="Aarti"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1f1f1f] mb-3">{t.home.aarti}</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-1">
                {t.home.aartiDesc}
              </p>
              <Link href="/library?tab=aarti" className="text-[#1f1f1f] font-bold text-xs uppercase tracking-wider hover:underline">
                {t.home.readAll}
              </Link>
            </div>

            {/* Card 2: Chalisa */}
            <div className="flex flex-col">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
                <img
                  src="https://www.srimandir.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fchaalisa_article_image.940dd0a3.webp&w=1920&q=75"
                  alt="Chalisa"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1f1f1f] mb-3">{t.home.chalisa}</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-1">
                {t.home.chalisaDesc}
              </p>
              <Link href="/library?tab=chalisa" className="text-[#1f1f1f] font-bold text-xs uppercase tracking-wider hover:underline">
                {t.home.readAll}
              </Link>
            </div>

            {/* Card 3: Mantra */}
            <div className="flex flex-col">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
                <img
                  src="https://www.srimandir.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmantra_article_image.c0b022ae.webp&w=1920&q=75"
                  alt="Mantra"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1f1f1f] mb-3">{t.home.mantra}</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-1">
                {t.home.mantraDesc}
              </p>
              <Link href="/library?tab=mantra" className="text-[#1f1f1f] font-bold text-xs uppercase tracking-wider hover:underline">
                {t.home.readAll}
              </Link>
            </div>
  
            {/* Card 4: Ayurvedic & Home Remedies */}
            <div className="flex flex-col">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
                <img
                  src="https://www.srimandir.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fayurvedic_article_image.0a07e763.webp&w=1920&q=75"
                  alt="Ayurvedic & Home Remedies"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1f1f1f] mb-3">{t.home.ayurvedic}</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-1">
                {t.home.ayurvedicDesc}
              </p>
              <Link href="/library?tab=remedies" className="text-[#1f1f1f] font-bold text-xs uppercase tracking-wider hover:underline">
                {t.home.readAll}
              </Link>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}

// --- Reviews Components ---
type Review = {
  _id: string;
  name: string;
  location: string;
  content: string;
  type: 'text' | 'video';
  videoUrl?: string;
  avatarUrl?: string;
  rating?: number;
};

const ReviewCard = ({ review }: { review: Review }) => {
  const isVideo = review.type === 'video';

  return (
    <div className="flex flex-col min-w-[280px] max-w-[340px] shrink-0">
      {isVideo ? (
        <div className="w-full h-[200px] rounded-2xl overflow-hidden shadow-sm mb-5 bg-black relative border border-gray-100">
          {review.videoUrl ? (
            <iframe
              src={review.videoUrl?.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80" alt="Video thumbnail" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-white text-xs font-semibold">
                 <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <span>0:00 / 1:00</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M17.657 6.343a8 8 0 010 11.314M12 2v20M2 12h20"/></svg>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                 </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[200px] bg-white border border-gray-200 rounded-2xl p-8 shadow-md mb-5 flex items-center justify-center text-left overflow-hidden hover:shadow-lg transition-shadow">
          <div className="overflow-y-auto w-full no-scrollbar">
            <p className="text-gray-900 italic text-[16px] font-semibold leading-[1.7]">
              {review.content}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 w-full px-2">
        <div className="h-12 w-12 rounded-full overflow-hidden shadow-md shrink-0 border-2 border-white">
          <img
            src={review.avatarUrl || `https://ui-avatars.com/api/?name=${review.name}&background=random`}
            alt={review.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-left">
          <h4 className="font-extrabold text-black text-base leading-none">{review.name}</h4>
          <p className="text-gray-600 text-[13px] font-bold mt-1.5">{review.location}</p>
        </div>
      </div>
    </div>
  );
};

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getCardWidth = () => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.children[0] as HTMLElement;
      if (firstCard) {
        const gap = 32; // gap-8 = 2rem = 32px
        return firstCard.offsetWidth + gap;
      }
    }
    return 340 + 32; // fallback
  };

  // Auto-scroll logic
  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const nextIndex = (currentIndex + 1) % reviews.length;
        const cardWidth = getCardWidth();

        container.scrollTo({
          left: nextIndex * cardWidth,
          behavior: 'smooth'
        });
        setCurrentIndex(nextIndex);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [reviews, currentIndex]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = getCardWidth();
      const newIndex = direction === 'left'
        ? Math.max(0, currentIndex - 1)
        : Math.min(reviews.length - 1, currentIndex + 1);

      container.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(newIndex);
    }
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading reviews...</div>;
  if (!reviews.length) return null;

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto pb-10 snap-x snap-mandatory scrollbar-hide no-scrollbar"
        onScroll={(e) => {
          const scrollLeft = e.currentTarget.scrollLeft;
          const cardWidth = getCardWidth();
          const index = Math.round(scrollLeft / cardWidth);
          if (index !== currentIndex) setCurrentIndex(index);
        }}
      >
        {reviews.map((review) => (
          <div key={review._id} className="snap-center">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center gap-4">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll('left')}
          className="h-8 w-8 rounded-full bg-[#d1d5db] flex items-center justify-center hover:bg-gray-400 transition-all shadow-sm active:scale-95"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180 text-white"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
        </button>

        {/* Dots */}
        <div className="flex gap-1.5 items-center">
          {reviews.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-4 bg-[#1f1f1f]" : "w-1.5 bg-[#cbd5e1]"
                }`}
            ></div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll('right')}
          className="h-8 w-8 rounded-full bg-[#1f1f1f] flex items-center justify-center shadow-md hover:bg-violet-700 active:scale-95 transition-all"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
}


// --- Dynamic Puja Cards Section ---
import React from "react";

type Puja = {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  slug?: string;
  createdAt?: string;
  badge?: string;
};

const PujaCard = ({ puja }: { puja: Puja }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-5">
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
      <div className="absolute bottom-3 left-3 bg-[#6869F9] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
        BOOK PUJA
      </div>
    </div>
    
    {/* Content Section */}
    <div className="pt-5 pb-1 px-1 flex flex-col flex-1 text-left">
      <p className="text-[#F47820] text-[11px] font-bold uppercase tracking-widest mb-3 text-center w-full">
        {puja.subtitle || "SPECIAL PUJA & YAGYA"}
      </p>
      <h3 className="text-[18px] font-bold text-[#1f1f1f] mb-3 leading-snug">
        {puja.title}
      </h3>
      <p className="text-gray-500 text-[14px] leading-relaxed line-clamp-2 mb-6 flex-1">
        {puja.description}
      </p>
      
      {/* Location & Date */}
      <div className="flex items-start gap-2.5 mb-3 text-[13px] text-gray-500">
        <svg className="w-[16px] h-[16px] text-[#a78bfa] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <span className="line-clamp-2 leading-tight">{(puja as any).location || "Sacred Temple, India"}</span>
      </div>
      <div className="flex items-start gap-2.5 mb-6 text-[13px] text-gray-500">
        <svg className="w-[16px] h-[16px] text-[#a78bfa] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span className="leading-tight">{(puja as any).date || "Upcoming Auspicious Date"}</span>
      </div>

      <Link href={`/puja/${puja.slug || String(puja.title || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`} className="w-full bg-[#6869F9] text-white text-[15px] font-bold tracking-wide py-3.5 rounded-lg hover:bg-[#5657e8] transition-colors flex items-center justify-center gap-1.5">
        {puja.buttonText || "PARTICIPATE"}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </Link>
    </div>
  </div>
);

export function PujaCardsSection() {
  const { t } = useTranslation();
  const [pujas, setPujas] = React.useState<Puja[]>([]);
  React.useEffect(() => {
    fetch("/api/special-pujas")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setPujas([]);
          return;
        }

        const recentThree = [...(data as Puja[])]
          .sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          })
          .slice(0, 3);

        setPujas(recentThree);
      });
  }, []);
  if (!pujas.length) return null;
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 w-full">
        {pujas.map((puja) => (
          <PujaCard key={puja._id} puja={puja} />
        ))}
      </div>
      <div className="mt-12">
        <Link href="/puja" className="text-[#1f1f1f] text-xl hover:text-[#000000] transition-all flex items-center gap-2 group">
          {t.home.viewAllPujas} <span className="group-hover:translate-x-2 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}

// Insert the PujaCardsSection below the filters and input

