"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";

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
                Offer Chadhava as per Vedic rituals at sacred Hindu Pilgrimages and Temples in India through AstroVed from anywhere in the world!
              </h1>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Divine Blessings through Chadhava.",
                  "Vedic Rituals Performed by Purohit ji.",
                  "Offer Chadhava from Anywhere.",
                  "Receive Chadhava Video in 2-3 days."
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
                  View Now
                </a>
                <a href="#how-it-works" className="inline-block bg-white text-gray-700 border border-gray-200 px-10 py-3.5 rounded-xl font-bold text-base hover:bg-gray-50 transition-all active:scale-95 text-center">
                  How It works?
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
            <h2 className="text-3xl font-bold text-[#1f1f1f] mb-3">Upcoming Chadhava Offerings on AstroVed.</h2>
            <p className="text-gray-600 max-w-3xl">
              Experience the divine with AstroVed Chadhava Seva. Offer Chadhava at renowned temples across India, receiving blessings and a video recording of the ceremony performed by our Purohit ji on your behalf.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f47820]"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
              <p className="text-gray-500">No offerings available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {items.map((item, index) => (
                <div key={item._id || item.slug || index} className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-[#f3eee5] hover:shadow-[0_20px_50px_rgba(14,145,95,0.1)] transition-all duration-500 group">
                  <div className="relative h-64 w-full">
                    <img 
                      src={item.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-[#1f1f1f] mb-3 leading-snug group-hover:text-[#0e915f] transition-colors">{item.title}</h3>
                    
                    {item.subtitle && (
                      <p className="text-[#1f1f1f] font-bold text-sm mb-4">{item.subtitle}</p>
                    )}
                    
                    <p className="text-gray-500 text-[14px] leading-relaxed line-clamp-4 mb-8">
                      {item.description}
                    </p>

                    <Link 
                      href={`/chadhava/${item.slug}`} 
                      className="inline-flex items-center justify-between w-full bg-[#0e915f] text-white py-4 px-6 rounded-xl font-bold hover:bg-[#0b7c50] transition-all group/btn"
                    >
                      <span>Perform Seva in {item.location || 'Temples'}</span>
                      <i className="fa-solid fa-arrow-right transition-transform group-hover/btn:translate-x-1"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Stats Section ── */}
          <section className="mt-20 border-t border-gray-100 pt-16">
            <h2 className="mb-2 text-2xl font-bold text-[#1f1f1f] md:text-3xl">
              Start your Sacred Journey with AstroVed Chadhava Service
            </h2>
            <p className="mb-8 text-sm text-gray-600">Why book AstroVed Online Chadhava?</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] p-8 text-center shadow-sm border border-[#bfdbfe]/50">
                <h3 className="text-2xl font-black text-[#1d4ed8]">10,00,000 +</h3>
                <p className="mt-1 text-sm font-semibold text-[#2563eb]">Chadhava Done</p>
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
              How does AstroVed Online Chadhava Works?
            </h2>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Choose Your Chadhava</h3>
                    <p className="mt-1 text-sm text-gray-600">Select your Chadhava offering from the list.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Your Information</h3>
                    <p className="mt-1 text-sm text-gray-600">Fill in the information of your Name and Gotra in the provided form.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f47820] text-sm font-bold text-white shadow-sm">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Chadhava video</h3>
                    <p className="mt-1 text-sm text-gray-600">The video of your Chadhava offered with your name and Gotra will be shared on WhatsApp.</p>
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
