"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import { useSearchParams } from "next/navigation";

const localeMap: Record<string, string> = {
  en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN",
};

function fmtDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function getTodayStr() { return fmtDate(new Date()); }
function getTomorrowStr() { const d = new Date(); d.setDate(d.getDate() + 1); return fmtDate(d); }
function addDays(s: string, n: number) { const d = new Date(s); d.setDate(d.getDate() + n); return fmtDate(d); }

function getFallbackData(dateStr?: string) {
  const base = dateStr ? new Date(dateStr) : new Date();
  const day = base.getDate();
  const tithis = ["Pratipada", "Dwitiya", "Tritiyaa", "Chaturthi", "Panchami"];
  const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Jyeshtha"];
  return {
    queryDate: base.toISOString(),
    tithi: { name: `Krishna-Paksha ${tithis[day % tithis.length]}`, endTime: "5:25 AM Till" },
    nakshatra: { name: nakshatras[day % nakshatras.length], endTime: "Till 12:55 PM" },
    yoga: { name: "Shiv", endTime: "Till 12:17 AM" },
    karana: { name: "Vishti", endTime: "Till 5:24 AM" },
    month: { amanta: "Vaishakh", purnimanta: "Jyeshtha" },
    samvat: { vikram: "2083 (Siddharth)", shaka: "1948 (Prabhau)" },
    sun: { sign: "Aries", rise: "5:20 AM", set: "6:31 PM" },
    moon: { sign: "Scorpio", rise: "9:57 PM", set: "7:30 AM", placement: "NORTH" },
    dishashool: "NORTH",
    season: "Vasant",
    ayana: "Uttarayana",
    festival: "Ekadanta Sankashti Chaturthi",
    auspiciousTimings: { abhijit: { start: "11:30 AM", end: "12:22 PM" } },
    inauspiciousTimings: {
      rahu: { start: "3:13 PM", end: "4:52 PM" },
      gulik: { start: "11:56 AM", end: "1:35 PM" },
      yamghant: { start: "8:38 AM", end: "10:17 AM" },
    },
    upcomingFestivals: [
      { date: "1 May, 2026", name: "Buddha Purnima" },
      { date: "2 May, 2026", name: "Jyeshtha Begins *North" },
      { date: "2 May, 2026", name: "Narada Jayanti" },
      { date: "3 May, 2026", name: "World Laughter Day" },
      { date: "4 May, 2026", name: "Agni Nakshatram Begins" },
      { date: "5 May, 2026", name: "Ekadanta Sankashti Chaturthi" },
      { date: "7 May, 2026", name: "Rabindranath Tagore Jayanti" },
      { date: "9 May, 2026", name: "Kalashtami" },
      { date: "9 May, 2026", name: "Masik Krishna Janmashtami" },
      { date: "9 May, 2026", name: "Tagore Jayanti *Bengal" },
      { date: "10 May, 2026", name: "Mother's Day" },
      { date: "12 May, 2026", name: "Hanuman Jayanti *Telugu" },
      { date: "13 May, 2026", name: "Apara Ekadashi" },
      { date: "14 May, 2026", name: "Pradosh Vrat" },
      { date: "15 May, 2026", name: "Masik Shivaratri" },
      { date: "16 May, 2026", name: "Darsha Amavasya" },
      { date: "17 May, 2026", name: "Shani Jayanti" },
      { date: "18 May, 2026", name: "Adhika Chandra Darshan" },
      { date: "20 May, 2026", name: "Adhika Vinayaka Chaturthi" },
      { date: "25 May, 2026", name: "Ganga Dussehra" },
      { date: "27 May, 2026", name: "Padmini Ekadashi" },
      { date: "28 May, 2026", name: "Adhika Pradosh Vrat" },
      { date: "31 May, 2026", name: "Jyeshtha Adhika Purnima" },
    ],
  };
}

function MoonPhaseIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#b0b8c1" />
      <circle cx="38" cy="34" r="8" fill="#8a929a" opacity="0.4" />
      <circle cx="30" cy="58" r="5" fill="#8a929a" opacity="0.3" />
      <circle cx="46" cy="68" r="6" fill="#8a929a" opacity="0.35" />
      <ellipse cx="62" cy="50" rx="36" ry="48" fill="#2d3748" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#f47820" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" fill="#f47820" />
    </svg>
  );
}

export default function PanchangClientPage() {
  const { t, language } = useTranslation();
  const searchParams = useSearchParams();

  const queryDate = searchParams?.get("date");
  const [selectedDate, setSelectedDate] = useState(queryDate || getTodayStr());
  const [data, setData] = useState<any>(getFallbackData(queryDate || getTodayStr()));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/panchang?date=${selectedDate}`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((json) => { if (json && typeof json === "object") setData(json); setLoading(false); })
      .catch(() => { setData(getFallbackData(selectedDate)); setLoading(false); });
  }, [selectedDate]);

  const isToday = selectedDate === getTodayStr();
  const isTomorrow = selectedDate === getTomorrowStr();

  const displayDateLabel = (() => {
    try {
      const d = new Date(selectedDate + "T12:00:00");
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    } catch { return selectedDate; }
  })();

  const weekday = (() => {
    try { return new Date(selectedDate + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long" }); }
    catch { return ""; }
  })();

  const formattedDisplayDate = (() => {
    const parts = selectedDate.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  })();

  const auspicious = data?.auspiciousTimings || {};
  const inauspicious = data?.inauspiciousTimings || {};
  const sun = data?.sun || {};
  const moon = data?.moon || {};

  const panchangFields = [
    { label: "Date",            value: data?.tithi?.name,      sub: data?.tithi?.endTime },
    { label: "Nakshatra",       value: data?.nakshatra?.name,  sub: data?.nakshatra?.endTime },
    { label: "Yoga",            value: data?.yoga?.name,       sub: data?.yoga?.endTime },
    { label: "Karana",          value: data?.karana?.name,     sub: data?.karana?.endTime },
    { label: "Month Amanta",    value: data?.month?.amanta,    sub: null },
    { label: "Month Purnimanta",value: data?.month?.purnimanta,sub: null },
    { label: "Vikram Samvat",   value: data?.samvat?.vikram,   sub: null },
    { label: "Shaka Samvat",    value: data?.samvat?.shaka,    sub: null },
    { label: "Sun Sign",        value: sun.sign,               sub: null },
    { label: "Moon Sign",       value: moon.sign,              sub: null },
    { label: "Dishashool",      value: data?.dishashool,       sub: null },
    { label: "Moon placement",  value: moon.placement,         sub: null },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fdf4e7" }}>

      {/* ── Controls Bar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-[68px] z-40" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[56px]">
          {/* Left */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(getTodayStr())}
              style={{ backgroundColor: isToday ? "#f47820" : "transparent", color: isToday ? "#fff" : "#6b7280" }}
              className="px-5 py-2 rounded-lg text-[14px] font-bold transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate(getTomorrowStr())}
              style={{ backgroundColor: isTomorrow ? "#f47820" : "transparent", color: isTomorrow ? "#fff" : "#6b7280" }}
              className="px-5 py-2 rounded-lg text-[14px] font-bold transition-colors"
            >
              Tomorrow
            </button>
            <button onClick={() => setSelectedDate(addDays(selectedDate, -1))} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="relative flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white cursor-pointer">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-[14px] font-medium text-gray-700 select-none">{formattedDisplayDate}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
            </div>
            <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          {/* Right: location */}
          <div className="relative flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white cursor-pointer min-w-[260px]">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <select className="appearance-none bg-transparent text-[14px] font-medium text-gray-700 outline-none w-full cursor-pointer">
              <option>Varanasi, Uttar Pradesh, India</option>
              <option>New Delhi, Delhi, India</option>
              <option>Mumbai, Maharashtra, India</option>
              <option>Chennai, Tamil Nadu, India</option>
            </select>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {loading && <div className="text-center py-2 text-sm text-gray-400 animate-pulse mb-3">Loading...</div>}

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_320px] gap-6 items-start">

          {/* ══════════════ COLUMN 1 ══════════════ */}
          <div className="flex flex-col gap-5">

            {/* Heading */}
            <div className="flex items-center pl-3 border-l-[3px] border-[#f47820] h-7">
              <h2 className="text-[16px] font-bold text-[#1a1a1a]">{displayDateLabel}</h2>
            </div>

            {/* Date Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
              <div className="p-5 flex gap-4 items-start">
                <div className="w-[80px] h-[80px] rounded-full overflow-hidden flex-shrink-0 bg-gray-300 border-2 border-gray-300">
                  <MoonPhaseIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[18px] font-bold text-[#1a1a1a] leading-snug">
                    {data?.tithi?.name},<br />{weekday}
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-1">{data?.month?.purnimanta} Month</p>
                  <p className="text-[13px] text-gray-500">{data?.season},{data?.samvat?.vikram}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 px-5 py-3">
                <p className="text-[12px] text-gray-400 font-medium mb-1">Festival</p>
                <p className="text-[14px] font-semibold text-[#f47820] cursor-pointer hover:underline leading-snug">
                  {data?.festival || "Ekadanta Sankashti Chaturthi"}
                </p>
              </div>
            </div>

            {/* Auspicious–Inauspicious Timings */}
            <div>
              <div className="flex items-center gap-2 pl-3 border-l-[3px] border-[#f47820] mb-4 h-7">
                <h2 className="text-[16px] font-bold text-[#1a1a1a]">Auspicious-Inauspicious Timings</h2>
                <HelpIcon />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Auspicious Timings */}
                <div className="rounded-xl px-4 py-4" style={{ backgroundColor: "#e8f5e9" }}>
                  <p className="text-[13px] font-bold mb-2" style={{ color: "#2e7d32" }}>Auspicious<br />Timings</p>
                  <p className="text-[13px] text-gray-700 leading-snug">
                    {auspicious.abhijit?.start} से {auspicious.abhijit?.end}
                  </p>
                </div>
                {/* Gulik Kaal */}
                <div className="rounded-xl px-4 py-4" style={{ backgroundColor: "#fffde7" }}>
                  <p className="text-[13px] font-bold mb-2" style={{ color: "#b8860b" }}>Gulik Kaal</p>
                  <p className="text-[13px] text-gray-700 leading-snug">
                    {inauspicious.gulik?.start} से {inauspicious.gulik?.end}
                  </p>
                </div>
                {/* Rahu Kaal */}
                <div className="rounded-xl px-4 py-4" style={{ backgroundColor: "#ffebee" }}>
                  <p className="text-[13px] font-bold mb-2" style={{ color: "#c62828" }}>Rahu Kaal</p>
                  <p className="text-[13px] text-gray-700 leading-snug">
                    {inauspicious.rahu?.start} से {inauspicious.rahu?.end}
                  </p>
                </div>
                {/* Yamghant Kaal */}
                <div className="rounded-xl px-4 py-4" style={{ backgroundColor: "#fce4ec" }}>
                  <p className="text-[13px] font-bold mb-2" style={{ color: "#ad1457" }}>Yamghant Kaal</p>
                  <p className="text-[13px] text-gray-700 leading-snug">
                    {inauspicious.yamghant?.start} से {inauspicious.yamghant?.end}
                  </p>
                </div>
              </div>
            </div>

            {/* Sun & Moon Times */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
              {[
                { icon: "☀️", label: "Sunrise",  value: sun.rise },
                { icon: "🌇", label: "Sunset",   value: sun.set },
                { icon: "🌕", label: "Moonrise", value: moon.rise },
                { icon: "🌑", label: "Moonset",  value: moon.set },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid #f1f1f1" : "none" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[22px]">{row.icon}</span>
                    <span className="text-[14px] font-semibold text-gray-700">{row.label}</span>
                  </div>
                  <span className="text-[14px] font-bold text-gray-900">{row.value || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════ COLUMN 2 ══════════════ */}
          <div>
            <div className="flex items-center gap-2 pl-3 border-l-[3px] border-[#f47820] mb-4 h-7">
              <h2 className="text-[16px] font-bold text-[#1a1a1a]">Panchang</h2>
              <HelpIcon />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
              <div className="grid grid-cols-2" style={{ borderBottom: "none" }}>
                {panchangFields.map((field, i) => {
                  const isLeft = i % 2 === 0;
                  const isLastRow = i >= panchangFields.length - 2;
                  return (
                    <div
                      key={field.label}
                      className="px-6 py-5"
                      style={{
                        borderBottom: !isLastRow ? "1px solid #f1f1f1" : "none",
                        borderRight: isLeft ? "1px solid #f1f1f1" : "none",
                      }}
                    >
                      <p className="text-[12px] text-gray-400 mb-1">{field.label}</p>
                      <p className="text-[15px] font-bold text-[#1a1a1a] leading-snug">{field.value || "—"}</p>
                      {field.sub && (
                        <p className="text-[12px] text-gray-400 mt-1">{field.sub}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══════════════ COLUMN 3 ══════════════ */}
          <div className="flex flex-col" style={{ height: "720px" }}>
            <div className="flex items-center pl-3 border-l-[3px] border-[#f47820] mb-4 h-7">
              <h2 className="text-[16px] font-bold text-[#1a1a1a]">Upcoming festivals</h2>
            </div>
            <div
              className="bg-white rounded-2xl border border-gray-100 flex-1 overflow-hidden flex flex-col"
              style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}
            >
              <div className="flex-1 overflow-y-auto">
                {(data?.upcomingFestivals || []).map((f: any, i: number, arr: any[]) => {
                  const isSelected = f.name === data?.festival;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer"
                      style={{ borderBottom: i < arr.length - 1 ? "1px solid #f1f1f1" : "none" }}
                    >
                      <span className="text-[13px] text-gray-400 whitespace-nowrap flex-shrink-0 mr-4">
                        {f.date}
                      </span>
                      <span
                        className="text-[14px] font-semibold text-right leading-snug"
                        style={{ color: isSelected ? "#f47820" : "#1a1a1a" }}
                      >
                        {f.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
