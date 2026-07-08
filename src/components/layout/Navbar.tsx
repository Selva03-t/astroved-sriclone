"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import LoginModal from "@/components/auth/LoginModal";

type SupportedLanguage = "en" | "hi" | "ta" | "te" | "kn";

// All nav items (used in desktop nav only)
const navKeys = [
  { key: "home", path: "/dashboard" },
  { key: "puja", path: "/puja" },
  { key: "chadhava", path: "/chadhava" },
  { key: "panchang", path: "/panchang" },
  { key: "temples", path: "/temples" },
  { key: "library", path: "/library" },
  { key: "astroTools", path: "/astro-tools" },
  { key: "store", path: "https://AstroVed-tau.vercel.app/", external: true },
];

const languageFullNames: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
};

export default function Navbar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close account panel on route change
  useEffect(() => { setAccountOpen(false); }, [pathname]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (accountOpen || langOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [accountOpen, langOpen]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.authenticated) setUser(d.user); else setUser(null); })
      .catch(() => setUser(null));
  }, [pathname]);

  const isActivePath = (path: string) =>
    pathname === path || (path !== "/dashboard" && pathname?.startsWith(path + "/"));

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/dashboard";
  };

  const handleLoginSuccess = () => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.authenticated) setUser(d.user); })
      .catch(() => {});
  };

  const isFullLanguagePage =
    pathname === "/" || pathname === "/dashboard" ||
    pathname === "/puja" || pathname?.startsWith("/puja/");

  const languageCodes = isFullLanguagePage
    ? ["en", "hi", "ta", "te", "kn"]
    : ["en", "hi"];

  // ── Sri Mandir–style account panel content ─────────────────────────────
  const AccountPanel = () => (
    <div className="fixed inset-0 z-[100] flex justify-end text-left">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" 
        onClick={() => setAccountOpen(false)} 
      />
      
      {/* Sidebar Drawer */}
      <div className="relative w-[340px] max-w-[85vw] h-full bg-white shadow-2xl flex flex-col overflow-y-auto animate-[slideInRight_0.3s_ease-out]">
        
        {/* Close Button */}
        <button 
          onClick={() => setAccountOpen(false)}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        <div className="flex-1 pb-10 pt-2">
          {/* Login / User header */}
          {!user ? (
            <div className="px-5 py-6 border-b border-gray-100">
              <p className="text-[13px] text-gray-500 font-medium mb-3 pr-8">
                To check all available pujas &amp; offers:
              </p>
              <button
                onClick={() => { setAccountOpen(false); setLoginModalOpen(true); }}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors"
              >
                Login / Create an account
              </button>
            </div>
          ) : (
            <div className="px-5 py-6 border-b border-gray-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#6869F9] flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-[13px] text-gray-400">Namaste 🙏</p>
                <p className="text-[15px] font-bold text-gray-900 pr-8 line-clamp-1">{user.name}</p>
              </div>
            </div>
          )}

      {/* Account Details */}
      <div className="px-3 py-2">
        <p className="px-2 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">Account Details</p>
        {[
          { href: user ? "/profile" : "#", label: "My profile", icon: <PersonIcon /> },
          { href: user ? "/bookings/puja" : "#", label: "My Puja Bookings", icon: <BookingIcon /> },
          { href: user ? "/bookings/chadhava" : "#", label: "My Chadhava Bookings", icon: <BookingIcon /> },
          { href: "https://AstroVed-tau.vercel.app/", label: "Store", icon: <StoreIcon />, badge: "New", external: true },
        ].map((item) => (
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-3.5 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-5 flex justify-center">{item.icon}</span>
                <span className="text-[14px] font-semibold text-gray-700">{item.label}</span>
                {item.badge && <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{item.badge}</span>}
              </div>
              <ChevronRight />
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              onClick={!user ? () => { setAccountOpen(false); setLoginModalOpen(true); } : undefined}
              className="flex items-center justify-between px-3 py-3.5 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-5 flex justify-center">{item.icon}</span>
                <span className="text-[14px] font-semibold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight />
            </Link>
          )
        ))}
      </div>

      {/* Welcome / Puja Seva section */}
      <div className="px-3 pb-2 border-t border-gray-100 pt-2">
        <p className="px-2 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Welcome to AstroVed Puja Seva
        </p>
        <Link
          href="/puja"
          className="flex items-center justify-between px-3 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <span className="text-gray-400 w-5 flex justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
            </span>
            <span className="text-[14px] font-semibold text-gray-700">How Puja Seva works?</span>
          </div>
          <ChevronRight />
        </Link>
      </div>

      {/* Help & Support */}
      <div className="px-3 pb-3 border-t border-gray-100 pt-2">
        <p className="px-2 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">Help &amp; Support for Puja Booking</p>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 mb-2">
          <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-green-600"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900">080-711-74417</p>
            <p className="text-[11px] text-gray-400">You can call us from 10:30 AM - 7:30 PM</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a href="mailto:support@AstroVed.com" className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors text-[13px] font-bold text-gray-700">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-red-500"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
            Email us
          </a>
          <a href="https://wa.me/918071174417" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors text-[13px] font-bold text-gray-700">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor" opacity=".8"/></svg>
            Whatsapp us
          </a>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="mt-2 w-full py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="inline h-4 w-4 mr-2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t("account.logout")}
          </button>
        )}
        </div>
      </div>
    </div>
    </div>
  );

  return (
    <>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} onSuccess={handleLoginSuccess} />

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-5 lg:px-8">

          {/* ── Logo ── */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0" aria-label="AstroVed Home">
            <img src="/images/logo.svg" alt="AstroVed" className="h-8 sm:h-9 lg:h-11 w-auto object-contain" />
          </Link>

          {/* ── Desktop Nav (lg+) ── */}
          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8 text-[14px] xl:text-[15px] font-semibold text-[#1a1a1a]">
              {navKeys.map((item) => (
                <li key={item.key}>
                  {item.external ? (
                    <a href={item.path} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#6869F9]">
                      {t(`nav.${item.key}`)}
                    </a>
                  ) : (
                    <Link
                      href={item.path}
                      className={isActivePath(item.path) ? "text-[#6869F9] font-bold" : "transition-colors hover:text-[#6869F9]"}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Language pill */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => { setLangOpen((p) => !p); setAccountOpen(false); }}
                aria-label="Select language"
                className="flex items-center gap-1 h-8 sm:h-9 px-3 rounded-full border border-gray-300 bg-white text-gray-700 text-[13px] font-bold hover:bg-gray-50 transition-colors"
              >
                <span>{language.slice(0, 2).charAt(0).toUpperCase() + language.slice(0, 2).charAt(1)}</span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 z-90 bg-white rounded-xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden min-w-[140px]">
                  <div className="py-1">
                    {languageCodes.map((code) => (
                      <button
                        key={code}
                        onClick={() => { setLanguage(code as SupportedLanguage); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${language === code ? "text-[#6869F9] bg-blue-50 font-bold" : "text-gray-700 hover:bg-gray-50 font-medium"}`}
                      >
                        {languageFullNames[code]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Account button + panel (visible on ALL screen sizes, Sri Mandir style) ── */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                aria-label="Account"
                aria-expanded={accountOpen}
                onClick={() => { setAccountOpen((p) => !p); setLangOpen(false); }}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 transition-colors overflow-hidden"
              >
                {user ? (
                  <span className="flex h-full w-full items-center justify-center bg-[#6869F9] text-white font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </span>
                ) : (
                  /* Sri Mandir–style 3-line person icon */
                  <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" aria-hidden="true">
                    <circle cx="20" cy="20" r="19" stroke="#e5e7eb" strokeWidth="1.2" fill="white" />
                    {/* head */}
                    <circle cx="20" cy="15" r="5" fill="#d1d5db" />
                    {/* body lines */}
                    <path d="M10 32c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="#d1d5db" />
                  </svg>
                )}
              </button>

              {accountOpen && <AccountPanel />}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// ── Small SVG helpers ─────────────────────────────────────────────────────
function ChevronRight() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-gray-300 shrink-0">
      <path d="M7.5 4.5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PersonIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7"/><path d="M5 19a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
}
function BookingIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function StoreIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
}
