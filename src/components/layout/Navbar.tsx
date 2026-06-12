"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import LoginModal from "@/components/auth/LoginModal";

type SupportedLanguage = "en" | "hi" | "ta" | "te" | "kn";

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

const languageDisplayNames: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
};

const fullLanguageOptions: { code: SupportedLanguage; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "à¤¹à¤¿à¤¨à¥à¤¦à¥€" },
  { code: "ta", label: "à®¤à®®à®¿à®´à¯" },
  { code: "te", label: "à°¤à±†à°²à±à°—à±" },
  { code: "kn", label: "à²•à²¨à³à²¨à²¡" },
];

const baseLanguageOptions = fullLanguageOptions.slice(0, 2);


export default function Navbar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const isActivePath = (path: string) => {
    return pathname === path || (path !== "/dashboard" && pathname?.startsWith(path + "/"));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/dashboard";
  };

  // After successful modal login — reload user info
  const handleLoginSuccess = () => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
      })
      .catch(() => {});
  };

  // Pages that show all 5 languages
  const isFullLanguagePage =
    pathname === "/" ||
    pathname === "/dashboard" ||
    pathname === "/puja" ||
    pathname?.startsWith("/puja/");

  return (
    <>
      {/* ── Login Modal ── */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <section className="sticky top-0 z-50 overflow-visible border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto] items-center gap-6 px-8 py-3.5 md:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-start">
            <Link href="/dashboard" className="flex items-center gap-3 pr-4">
              <img
                src="/images/logo.svg"
                alt="AstroVed Logo"
                className="h-9 md:h-11 w-auto object-contain"
              />
            </Link>
          </div>

          <nav aria-label="Dashboard navigation" className="hidden md:block md:justify-self-center">
            <ul className="flex items-center gap-8 text-[15px] font-semibold text-[#1a1a1a]">
              {navKeys.map((item) => (
                <li key={item.key}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-[#1f1f1f]"
                    >
                      {t(`nav.${item.key}`)}
                    </a>
                  ) : (
                    <Link
                      href={item.path}
                      className={
                        isActivePath(item.path)
                          ? "text-[#5B5BF6] font-bold"
                          : "transition-colors hover:text-[#5B5BF6]"
                      }
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="justify-self-end flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all duration-300 hover:bg-gray-50 md:hidden"
            >
              {mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>

            {/* Language Dropdown - Click based */}
            <div className="relative hidden md:block" ref={langRef}>
              <button
                onClick={() => setLangOpen((prev) => !prev)}
                aria-label={`Select language: ${(isFullLanguagePage ? fullLanguageOptions : baseLanguageOptions).map((item) => item.code).join(", ")}`}
                className="flex items-center gap-1.5 h-[38px] px-3.5 rounded-full border border-gray-200 bg-white text-gray-700 text-[14px] font-medium hover:bg-gray-50 transition-colors"
              >
                {languageDisplayNames[language] || "English"}
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 z-90">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden" style={{ minWidth: "140px" }}>
                    <div className="py-1">
                      {[
                        { code: "en", label: "English" },
                        { code: "hi", label: "हिन्दी" },
                        ...(isFullLanguagePage ? [
                          { code: "ta", label: "தமிழ்" },
                          { code: "te", label: "తెలుగు" },
                          { code: "kn", label: "ಕನ್ನಡ" },
                        ] : []),
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code as SupportedLanguage); setLangOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            language === lang.code
                              ? "text-[#1f1f1f] bg-blue-50 font-bold"
                              : "text-gray-700 hover:bg-blue-50 hover:text-[#1f1f1f] font-medium"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account dropdown */}
            <div className="group relative hidden md:block">
              <button
                type="button"
                aria-label="Account menu"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50"
              >
                {user ? (
                  <div className="h-full w-full flex items-center justify-center bg-[#6869F9] text-white rounded-full font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                )}
              </button>

              <div className="pointer-events-none absolute right-0 top-full z-80 w-[320px] pt-3 opacity-0 translate-y-3 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
                  {!user ? (
                    <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                      <p className="text-[13px] text-gray-500 font-medium mb-3">To check all available pujas &amp; offers:</p>
                      {/* ── Trigger modal on click ── */}
                      <button
                        onClick={() => setLoginModalOpen(true)}
                        className="block w-full bg-[#6869F9] text-white text-center py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-100 hover:bg-[#5657e8] transition-all"
                      >
                        {t("account.login")}
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 border-b border-gray-50 bg-[#6869F9]/5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#6869F9] text-white rounded-full flex items-center justify-center font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#1f1f1f] uppercase tracking-wider">Namaste,</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-2">
                    <p className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Account Details</p>
                    <nav className="space-y-0.5">
                      <Link href={user ? "/profile" : "#"} onClick={!user ? () => setLoginModalOpen(true) : undefined} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                        <div className="flex items-center gap-4">
                          <i className="fa-solid fa-user text-gray-400 group-hover/item:text-[#6869F9] transition-colors"></i>
                          <span className="text-[14px] font-semibold text-gray-700">{t("account.profile")}</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                      </Link>

                      <Link href={user ? "/bookings/puja" : "#"} onClick={!user ? () => setLoginModalOpen(true) : undefined} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                        <div className="flex items-center gap-4">
                          <i className="fa-solid fa-calendar-check text-gray-400 group-hover/item:text-[#6869F9] transition-colors"></i>
                          <span className="text-[14px] font-semibold text-gray-700">{t("account.pujaBookings")}</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                      </Link>

                      <Link href={user ? "/bookings/chadhava" : "#"} onClick={!user ? () => setLoginModalOpen(true) : undefined} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                        <div className="flex items-center gap-4">
                          <i className="fa-solid fa-box-open text-gray-400 group-hover/item:text-[#6869F9] transition-colors"></i>
                          <span className="text-[14px] font-semibold text-gray-700">{t("account.chadhavaBookings")}</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                      </Link>

                      <Link href="/puja" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                        <div className="flex items-center gap-4">
                          <i className="fa-solid fa-om text-gray-400 group-hover/item:text-[#1f1f1f] transition-colors"></i>
                          <span className="text-[14px] font-semibold text-gray-700">{t("account.bookPuja")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#00c26d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
                          <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                        </div>
                      </Link>

                      <Link href="/chadhava" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                        <div className="flex items-center gap-4">
                          <i className="fa-solid fa-hands-praying text-gray-400 group-hover/item:text-[#1f1f1f] transition-colors"></i>
                          <span className="text-[14px] font-semibold text-gray-700">{t("account.bookChadhava")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#00c26d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
                          <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                        </div>
                      </Link>

                      <Link href="/astro-tools" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                        <div className="flex items-center gap-4">
                          <i className="fa-solid fa-wand-magic-sparkles text-gray-400 group-hover/item:text-blue-600 transition-colors"></i>
                          <span className="text-[14px] font-semibold text-gray-700">Astro Tools</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                      </Link>

                      <a href="https://AstroVed-tau.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                        <div className="flex items-center gap-4">
                          <i className="fa-solid fa-cart-shopping text-gray-400 group-hover/item:text-blue-500 transition-colors"></i>
                          <span className="text-[14px] font-semibold text-gray-700">Store</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#00c26d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
                          <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                        </div>
                      </a>
                    </nav>
                  </div>

                  <div className="p-4 bg-gray-50/50 space-y-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t("account.helpSupport")}</p>
                    <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl">
                      <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-900">080-711-74417</p>
                        <p className="text-[10px] text-gray-400 font-medium tracking-tight">Available from 10:30 AM - 7:30 PM</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a href="mailto:support@AstroVed.com" className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all">
                        <i className="fa-regular fa-envelope text-red-500"></i>
                        <span className="text-xs font-bold text-gray-700">Email us</span>
                      </a>
                      <a href="https://wa.me/918071174417" className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all">
                        <i className="fa-brands fa-whatsapp text-blue-500"></i>
                        <span className="text-xs font-bold text-gray-700">Whatsapp</span>
                      </a>
                    </div>

                    {user && (
                      <button
                        onClick={handleLogout}
                        className="w-full py-2.5 mt-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <i className="fa-solid fa-power-off mr-2"></i> {t("account.logout")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mx-auto max-w-6xl overflow-hidden px-6 transition-all duration-300 md:hidden ${mobileMenuOpen ? "max-h-[80vh] pb-4" : "max-h-0"}`}>
          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <nav aria-label="Mobile navigation">
              <ul className="space-y-1">
                {navKeys.map((item) => (
                  <li key={`mobile-${item.key}`}>
                    {item.external ? (
                      <a
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {t(`nav.${item.key}`)}
                      </a>
                    ) : (
                      <Link
                        href={item.path}
                        className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                          isActivePath(item.path) ? "bg-[#5B5BF6]/10 text-[#5B5BF6] font-bold" : "text-gray-700 hover:bg-gray-50 hover:text-[#5B5BF6]"
                        }`}
                      >
                        {t(`nav.${item.key}`)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile language switcher */}
            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="px-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Language</p>
              <div className="flex flex-wrap gap-2 px-2">
                {["en", "hi", ...(isFullLanguagePage ? ["ta", "te", "kn"] : [])].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as SupportedLanguage)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${language === lang ? "bg-[#6869F9] text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    {languageDisplayNames[lang]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 border-t border-gray-100 pt-3">
              {user ? (
                <>
                  <p className="px-2 text-xs font-bold uppercase tracking-wider text-[#1f1f1f]">Namaste, {user.name}</p>
                  <div className="mt-2 space-y-1">
                    <Link href="/profile" className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">My Profile</Link>
                    <Link href="/bookings/puja" className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">My Puja Bookings</Link>
                    <Link href="/bookings/chadhava" className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">My Chadhava Bookings</Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                /* Mobile: open modal */
                <button
                  onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }}
                  className="block w-full rounded-xl bg-[#6869F9] px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-blue-100 transition-all hover:bg-[#5657e8]"
                >
                  {t("account.login")}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
