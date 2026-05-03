"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

interface PanchangItem {
  _id: string;
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
}

export default function PanchangPage() {
  const [items, setItems] = useState<PanchangItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/panchang")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
           // Sort by date
           const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
           setItems(sorted);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fffdf9] py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#2c1c4e] mb-2">Hindu Panchang</h1>
            <p className="text-gray-500">Daily auspicious timings and planetary positions.</p>
          </div>

          {loading ? (
             <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse"></div>)}
             </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
               <div className="text-6xl mb-4">📅</div>
               <p className="text-gray-500">No panchang data available for the selected period.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-3xl shadow-sm border border-orange-50 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 px-8 py-4 flex justify-between items-center text-white">
                     <div className="text-2xl font-bold">
                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                     </div>
                     <div className="bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur-md">
                        {new Date(item.date).toLocaleDateString('en-IN', { weekday: 'long' })}
                     </div>
                  </div>
                  <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                     <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tithi</div>
                        <div className="text-lg font-bold text-gray-900">{item.tithi}</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nakshatra</div>
                        <div className="text-lg font-bold text-gray-900">{item.nakshatra}</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Yoga</div>
                        <div className="text-lg font-bold text-gray-900">{item.yoga}</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Karana</div>
                        <div className="text-lg font-bold text-gray-900">{item.karana}</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sunrise</div>
                        <div className="text-lg font-bold text-orange-600 font-mono"> {item.sunrise}</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sunset</div>
                        <div className="text-lg font-bold text-purple-600 font-mono"> {item.sunset}</div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
