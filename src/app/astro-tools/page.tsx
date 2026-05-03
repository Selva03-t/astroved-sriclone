"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

interface AstroTool {
  _id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
}

function NakshatraFinderToolCard() {
  return (
    <div className="h-full bg-white p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-green-100 mb-6 bg-white">
        <img
          src="https://imgs.search.brave.com/acCjMCO5vYOt4Fj3wdCMtAipxx5GpIeFIJ-3Grf2FcQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9uYWtz/aGF0cmEtdmVkaWMt/YXN0cm9sb2d5LWls/bHVzdHJhdGlvbi1y/YXNoaS1ncmFoYS1s/YWduYS1kYXNoYS1i/aGF2YS1yYWh1LW5h/a3NoYXRyYS12ZWRp/Yy1hc3Ryb2xvZ3kt/bmFrc2hhdHJhLXZl/ZGljLWFzdHJvbG9n/eS0zNzM5MzI2MDAu/anBn"
          alt="Nakshatra Finder"
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Nakshatra Finder</h3>
      <p className="text-gray-500 leading-relaxed mb-8">
        Find Nakshatra, Pada, Rasi, Tithi, Gana, Nadi, Lord and Name Alphabet using your birth date and time.
      </p>
      <Link
        href="/astro-tools/nakshatra"
        className="mt-auto rounded-full bg-green-600 px-6 py-2 font-bold text-white transition hover:bg-green-700"
      >
        Use Tool
      </Link>
    </div>
  );
}

export default function AstroToolsPage() {
  const [items, setItems] = useState<AstroTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/astro-tools")
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
      <main className="min-h-screen bg-[#f8fafc] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-[#2c1c4e] mb-4 bg-clip-text bg-linear-to-r from-purple-700 to-blue-600">
              Astrology Tools
            </h1>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto">
              Precision calculated tools for your spiritual and astrological needs.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <NakshatraFinderToolCard />
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-white rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <NakshatraFinderToolCard />
              {/* Show some default/placeholder tools if none uploaded */}
              <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6">🔭</div>
                <h3 className="text-xl font-bold mb-2">Kundali Matching</h3>
                <p className="text-gray-500 mb-6">Check compatibility between two horoscopes for marriage.</p>
                <button className="mt-auto px-6 py-2 bg-purple-600 text-white rounded-full font-bold">Open Tool</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <NakshatraFinderToolCard />
              {items.map((item) => (
                <Link key={item._id} href={item.url || "#"} className="group">
                    <div className="h-full bg-white p-8 rounded-4xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-24 h-24 mb-6 rounded-4xl overflow-hidden bg-gray-50 p-2 border border-gray-100 group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors">
                            <img 
                                src={item.imageUrl || "https://images.unsplash.com/photo-1506318137071-a8e063b4b477?auto=format&fit=crop&w=800&q=80"} 
                                alt={item.name}
                                className="w-full h-full object-cover rounded-3xl"
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">{item.name}</h3>
                        <p className="text-gray-500 leading-relaxed mb-8">{item.description}</p>
                        <div className="mt-auto flex items-center text-purple-600 font-bold">
                            Get Started <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                        </div>
                    </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
