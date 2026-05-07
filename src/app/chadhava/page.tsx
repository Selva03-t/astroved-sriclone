"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

interface Chadhava {
  _id: string;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  price: number;
  slug: string;
  subtitle?: string;
}

export default function ChadhavaPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Chadhava[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chadhava")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fffdf9]">
        {/* New Hero Section */}
        <section className="bg-linear-to-r from-[#fff5e9] to-[#ffffff] py-12 md:py-16 mb-12">
          <div className="mx-auto max-w-7xl px-6 flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1f1f1f] leading-tight mb-8">
                {t.chadhava.heroTitle}
              </h1>
              
              <ul className="space-y-4 mb-10">
                {[
                  t.chadhava.feature1,
                  t.chadhava.feature2,
                  t.chadhava.feature3,
                  t.chadhava.feature4
                ].map((text, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="h-5 w-5 rounded-full bg-[#f47820] flex items-center justify-center shrink-0">
                       <i className="fa-solid fa-check text-[10px] text-white"></i>
                    </div>
                    {text}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4">
                <a href="#upcoming" className="inline-block bg-[#0e915f] text-white px-10 py-3.5 rounded-xl font-bold text-base hover:bg-[#0b7c50] transition-all shadow-lg shadow-green-900/10 active:scale-95 text-center">
                  {t.chadhava.viewNow}
                </a>
                <a href="#how-it-works" className="inline-block bg-white text-gray-700 border border-gray-200 px-10 py-3.5 rounded-xl font-bold text-base hover:bg-gray-50 transition-all active:scale-95 text-center">
                  {t.chadhava.howItWorks}
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative w-full max-w-2xl">
              <img 
                src="https://www.srimandir.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimg_chadhava_web_banner.3fc5e49e.webp&w=1200&q=75" 
                alt="Chadhava Banner" 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </section>

        <div id="upcoming" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#1f1f1f] mb-3">{t.chadhava.upcomingTitle}</h2>
            <p className="text-gray-600 max-w-3xl">
              {t.chadhava.upcomingDesc}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f47820]"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
              <p className="text-gray-500">{t.chadhava.noOfferings}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <div
                  key={item._id || item.slug || index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-5"
                >
                  {/* Image Section */}
                  <div className="relative h-[220px] w-full rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1601024445121-e5b82f020549?auto=format&fit=crop&w=800&q=80"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="pt-5 pb-1 px-1 flex flex-col flex-1 text-left">
                    <h3 className="text-[18px] font-bold text-[#1f1f1f] mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-[14px] leading-relaxed line-clamp-3 mb-6 flex-1">
                      {item.description}
                    </p>

                    <Link href={`/chadhava/${item.slug || String(item.title || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`} className="w-full bg-[#0e915f] text-white text-[15px] font-bold tracking-wide py-3.5 rounded-lg hover:bg-[#0b7c50] transition-colors flex items-center justify-center gap-1.5 mt-auto">
                      {(item as any).buttonText || t.chadhava.performSeva}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Stats Section ── */}
          <section className="mt-20 border-t border-gray-100 pt-16">
            <h2 className="mb-2 text-2xl font-bold text-[#1f1f1f] md:text-3xl">
              {t.chadhava.sacredJourney}
            </h2>
            <p className="mb-8 text-sm text-gray-600">{t.chadhava.whyBook}</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] p-8 text-center shadow-sm border border-[#bfdbfe]/50">
                <h3 className="text-2xl font-black text-[#1d4ed8]">10,00,000 +</h3>
                <p className="mt-1 text-sm font-semibold text-[#2563eb]">{t.chadhava.chadhavaDone}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff] p-8 text-center shadow-sm border border-[#e9d5ff]/50">
                <h3 className="text-2xl font-black text-[#6969fa]">300,000 +</h3>
                <p className="mt-1 text-sm font-semibold text-[#6969fa]/80">{t.chadhava.happyDevotees}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3] p-8 text-center shadow-sm border border-[#fbcfe8]/50">
                <h3 className="text-2xl font-black text-[#be185d]">100 +</h3>
                <p className="mt-1 text-sm font-semibold text-[#db2777]">{t.chadhava.famousTemples}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] p-8 text-center shadow-sm border border-[#fed7aa]/50">
                <h3 className="text-2xl font-black text-[#f47820]">{t.chadhava.sankalp}</h3>
                <p className="mt-1 text-sm font-semibold text-[#f47820]/80">{t.chadhava.sankalpDesc}</p>
              </div>
            </div>
          </section>
        
          {/* ── How it works ── */}
          <section id="how-it-works" className="mt-20">
            <h2 className="mb-8 border-b border-gray-200 pb-4 text-2xl font-bold text-[#1f1f1f] md:text-3xl">
              {t.chadhava.howItWorksTitle}
            </h2>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{t.chadhava.step1Title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t.chadhava.step1Desc}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{t.chadhava.step2Title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t.chadhava.step2Desc}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{t.chadhava.step3Title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t.chadhava.step3Desc}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">4</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{t.chadhava.step4Title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t.chadhava.step4Desc}</p>
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
