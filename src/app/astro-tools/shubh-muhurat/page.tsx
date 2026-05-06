"use client";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const PURPOSES = [
  { label: "Marriage / Vivah", icon: "💍" },
  { label: "Business Start / Vyapar", icon: "🏢" },
  { label: "Travel / Yatra", icon: "✈️" },
  { label: "Property Purchase / Griha", icon: "🏠" },
  { label: "Vehicle Purchase / Vahan", icon: "🚗" },
  { label: "New Job / Naukri", icon: "💼" },
  { label: "Education / Vidyarambha", icon: "📚" },
  { label: "Medical Procedure", icon: "🏥" },
];

interface AuspiciousTimings {
  abhijit?: { start: string; end: string };
}

interface PanchangData {
  auspiciousTimings?: AuspiciousTimings;
  tithi?: { name: string; endTime: string };
  nakshatra?: { name: string; endTime: string };
  yoga?: { name: string };
  sun?: { rise?: string; set?: string };
  festival?: string;
}

export default function ShubhMuhuratPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedPurpose, setSelectedPurpose] = useState(PURPOSES[0].label);
  const [data, setData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setSubmitted(true);
    fetch(`/api/panchang?date=${selectedDate}`)
      .then(r => r.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auspicious = data?.auspiciousTimings ?? {};
  const purpose = PURPOSES.find(p => p.label === selectedPurpose) ?? PURPOSES[0];

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ backgroundColor: "#fdf4e7" }}>
        <div style={{ backgroundColor: "#fff8f0", borderBottom: "1px solid #f0e0c8" }} className="py-4">
          <div className="max-w-5xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-[#f47820]">Home</Link>
              <span>/</span>
              <Link href="/astro-tools" className="hover:text-[#f47820]">Astrology Calculator</Link>
              <span>/</span>
              <span className="text-[#f47820] font-medium">Shubh Muhurat Finder</span>
            </nav>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🕐</span>
                  <h1 className="text-xl font-bold">Shubh Muhurat Finder</h1>
                </div>
                <p className="text-yellow-50 text-sm">Find the most auspicious time for any important occasion based on the Panchang.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Date</label>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Purpose</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PURPOSES.map((p) => (
                      <button key={p.label} onClick={() => setSelectedPurpose(p.label)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition text-left"
                        style={{
                          backgroundColor: selectedPurpose === p.label ? "#fff8ed" : "#f9fafb",
                          borderColor: selectedPurpose === p.label ? "#f47820" : "#e5e7eb",
                          color: selectedPurpose === p.label ? "#f47820" : "#374151",
                        }}>
                        <span>{p.icon}</span>
                        <span className="leading-tight">{p.label.split(" / ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={fetchData}
                  className="w-full py-3 rounded-xl font-bold text-white transition text-sm"
                  style={{ backgroundColor: "#d97706" }}>
                  Find Shubh Muhurat →
                </button>
              </div>
            </div>

            {/* Results */}
            <div>
              {loading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center animate-pulse" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                  <div className="text-5xl mb-4">🕐</div>
                  <p className="text-gray-400 text-sm">Fetching Panchang data...</p>
                </div>
              ) : !data ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                  <div className="text-5xl mb-4">🕐</div>
                  <p className="text-gray-400 text-sm">Select a date and purpose, then click Find Shubh Muhurat.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                  {/* Header */}
                  <div className="p-5 border-b border-amber-100" style={{ backgroundColor: "#fffbeb" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{purpose.icon}</span>
                      <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Shubh Muhurat For</p>
                        <p className="text-base font-bold text-amber-800">{selectedPurpose.split(" / ")[0]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Abhijit Muhurat */}
                    {auspicious.abhijit ? (
                      <div className="rounded-xl p-4 border border-green-200" style={{ backgroundColor: "#f0fdf4" }}>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-green-600 mb-1">✨ Abhijit Muhurat (Most Auspicious)</p>
                        <p className="text-xl font-extrabold text-green-700">
                          {auspicious.abhijit.start} – {auspicious.abhijit.end}
                        </p>
                        <p className="text-xs text-green-500 mt-1">This is the daily Shubh Muhurat recommended for all auspicious activities.</p>
                      </div>
                    ) : (
                      <div className="rounded-xl p-4 border border-gray-200 bg-gray-50 text-sm text-gray-400 text-center">
                        Muhurat data unavailable for this date
                      </div>
                    )}

                    {/* Panchang Context */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Tithi", value: data.tithi?.name },
                        { label: "Nakshatra", value: data.nakshatra?.name },
                        { label: "Yoga", value: data.yoga?.name },
                        { label: "Festival", value: data.festival || "—" },
                      ].map(item => (
                        <div key={item.label} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">{item.label}</p>
                          <p className="text-sm font-bold text-gray-800">{item.value || "—"}</p>
                        </div>
                      ))}
                    </div>

                    {/* Sunrise/Sunset */}
                    {data.sun && (
                      <div className="flex gap-4 justify-center rounded-xl bg-amber-50 border border-amber-100 py-3">
                        <div className="text-center">
                          <span className="text-xl">☀️</span>
                          <p className="text-xs text-gray-400">Sunrise</p>
                          <p className="text-sm font-bold text-gray-700">{data.sun.rise || "—"}</p>
                        </div>
                        <div className="w-px bg-amber-200" />
                        <div className="text-center">
                          <span className="text-xl">🌇</span>
                          <p className="text-xs text-gray-400">Sunset</p>
                          <p className="text-sm font-bold text-gray-700">{data.sun.set || "—"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h2 className="text-base font-bold text-[#2d1a0e] mb-2">What is Shubh Muhurat?</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              A Muhurat (or Muhurta) is an auspicious time period selected based on the Panchang (Hindu almanac).
              The Panchang considers five elements — Tithi (lunar day), Nakshatra (star), Yoga, Karana, and Var (weekday)
              — to determine the most favorable time for starting important activities like marriages, business ventures,
              travel, or property purchases. The Abhijit Muhurat, occurring around midday, is universally auspicious.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
