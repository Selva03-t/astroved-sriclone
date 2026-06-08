"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { DEFAULT_COUNTRY } from "@/lib/auth/countries";
import { authService } from "@/services/authService";

type LoginMethod = "email" | "phone" | "whatsapp";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,15}$/;

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m5 7 6.2 4.8a1.3 1.3 0 0 0 1.6 0L19 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M12 3.5A8.5 8.5 0 0 0 4.8 16.7L3.5 20.5l3.9-1.2A8.5 8.5 0 1 0 12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" fill="none" />
      <path d="M9.3 8.8c.2-.5.5-.5.7-.5.2 0 .4 0 .6.5.2.6.7 1.6.8 1.7.1.1.1.2 0 .4-.1.2-.2.4-.3.5-.1.1-.2.2-.3.4-.1.1-.2.3 0 .5.2.2.7 1.2 1.8 1.9 1.4.9 2 .8 2.3.7.4-.1 1.2-1.1 1.3-1.5.1-.3.2-.3.3-.3.1 0 1 .4 1.2.5.2.1.3.2.3.3 0 .1-.2 1.1-.9 1.8-.8.8-1.9 1.2-2.6 1.1-.7-.1-2.1-.5-3.8-2.1-1.9-1.7-2.4-3.3-2.5-4.1-.1-.8.3-1.6.8-2.1Z" />
    </svg>
  );
}

// AstroVed Logo mark (A shape from their SVG)
function AstroVedMark({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="28" fill="white" fillOpacity="0.15" />
      <path d="M28 8c-.12-.03-.14.06-.17.14-.19.54-.57.97-.76 1.52-.15.42-.55.74-.77 1.14-.62 1.16-1.38 2.23-2.02 3.37-.65 1.17-1.26 2.37-1.96 3.5-1.91 3.1-3.63 6.31-5.51 9.43-.68 1.12-1.33 2.25-1.98 3.39-.2.35-.52.4-.87.4-1.34 0-2.68.03-4.02-.01-.87-.02-1.73.13-2.59.12-.5-.01-.6-.13-.34-.53.76-1.16 1.37-2.4 2.09-3.58.9-1.49 1.81-2.97 2.59-4.53.55-1.1 1.3-2.09 1.92-3.16.88-1.51 1.76-3.02 2.57-4.57.47-.87.96-1.74 1.54-2.56.64-.89 1.1-1.9 1.65-2.85.91-1.61 1.8-3.24 2.76-4.83.52-.87 1.08-1.72 1.56-2.62.31-.59.7-1.13 1-1.71.87-1.66 2-3.17 2.85-4.85.04-.08.07-.17.12-.24.14-.18.08-.58.31-.56.22.02.38.34.51.57 1.1 2.07 2.45 4 3.5 6.1.73 1.45 1.67 2.78 2.5 4.18a98.7 98.7 0 0 1 2.02 3.56c.62 1.17 1.26 2.34 2.1 3.36.18.22.1.47.23.7 1.06 1.73 2.03 3.51 3.1 5.23.96 1.53 1.78 3.16 2.69 4.72 1.43 2.44 2.88 4.87 4.31 7.31.08.14.17.29.2.44.05.23-.04.41-.31.38-2.09-.21-4.19-.07-6.28-.07-.77 0-1.17-.24-1.56-.92-1.97-3.5-4.02-6.95-6.03-10.42C32.97 21.97 30.97 18.5 28.7 15c-.12-.2-.21-.43-.47-.5h.01Z" fill="white" />
      <path d="M34 35.6c-.07.43-.4.66-.65.93-.65.67-1.31 1.33-1.96 1.99-.96.99-1.91 1.98-2.87 2.97-.21.22-.37.17-.59-.04a1044 1044 0 0 0-5.35-5.38c-.26-.26-.29-.44-.07-.78a44.2 44.2 0 0 0 1.57-2.67c.77-1.46 1.66-2.85 2.5-4.27.47-.78.99-1.53 1.34-2.4.15-.37.43-.19.57.05a70.8 70.8 0 0 1 1.46 2.47c1.09 1.97 2.15 3.95 3.37 5.84.27.41.46.87.68 1.3Z" fill="#F47820" />
    </svg>
  );
}

export default function LoginMethods() {
  const [method, setMethod] = useState<LoginMethod>("whatsapp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [isIndian, setIsIndian] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    // 1. Check if admin path requested via URL
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    if (role === "admin") {
      setIsAdmin(true);
      setMethod("email");
      setDetecting(false);
      return;
    }

    // 2. Dynamically detect country using GeoIP
    async function detectCountry() {
      try {
        const res = await fetch("/api/auth/geoip");
        const data = await res.json();
        if (data && data.country) {
          setDetectedCountry(data.country);
          // Indian users → WhatsApp OTP; Foreign users → Email OTP
          if (data.country === "IN") {
            setIsIndian(true);
            setMethod("whatsapp");
          } else {
            setIsIndian(false);
            setMethod("email");
          }
        } else {
          // Default: Indian
          setIsIndian(true);
          setMethod("whatsapp");
        }
      } catch (err) {
        console.error("GeoIP detection failed:", err);
        setIsIndian(true);
        setMethod("whatsapp");
      } finally {
        setDetecting(false);
      }
    }
    detectCountry();
  }, []);

  const isValid = useMemo(() => {
    if (method === "email") {
      if (isAdmin) {
        return emailRegex.test(email) && password.length > 0;
      }
      return emailRegex.test(email);
    }
    if (method === "phone") return phoneRegex.test(phone);
    return phoneRegex.test(whatsapp);
  }, [method, email, password, phone, whatsapp, isAdmin]);

  const placeholder =
    method === "email"
      ? "Enter your email address"
      : method === "phone"
        ? "Enter your phone number"
        : "Enter your WhatsApp number";

  const value =
    method === "email" ? email : method === "phone" ? phone : whatsapp;

  const setValue = (nextValue: string) => {
    if (method === "email") {
      setEmail(nextValue);
      return;
    }

    const digitsOnly = nextValue.replace(/[^0-9]/g, "");
    if (method === "phone") {
      setPhone(digitsOnly);
      return;
    }
    setWhatsapp(digitsOnly);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (method === "email" && isAdmin) {
        const data = await authService.loginWithEmail({ email, password });

        if (data.isAdmin) {
          window.location.href = "/admin";
          return;
        }

        const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl") || "/dashboard";
        window.location.href = callbackUrl;
        return;
      }

      if (method === "email") {
        // Foreign user Email OTP flow
        await authService.sendOtp({
          method: "email",
          email,
        } as any);

        const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
        const params = new URLSearchParams({
          method: "email",
          email,
        });

        if (callbackUrl) params.set("callbackUrl", callbackUrl);

        window.location.href = `/auth/otp?${params.toString()}`;
        return;
      }

      // Indian Mobile/WhatsApp OTP flow
      const number = method === "whatsapp" ? whatsapp : phone;
      await authService.sendOtp({
        method,
        country: DEFAULT_COUNTRY,
        number,
      });

      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
      const params = new URLSearchParams({
        method,
        country: DEFAULT_COUNTRY.isoCode,
        number,
      });

      if (callbackUrl) params.set("callbackUrl", callbackUrl);

      window.location.href = `/auth/otp?${params.toString()}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (detecting) {
    return (
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(104,105,249,0.25)] flex" style={{ minHeight: 420 }}>
        {/* Left panel */}
        <div className="hidden md:flex w-[200px] flex-col items-center justify-center p-8" style={{ background: "linear-gradient(145deg, #6869F9 0%, #4546d4 100%)" }}>
          <AstroVedMark size={56} />
          <p className="mt-4 text-white font-bold text-xl tracking-tight">AstroVed</p>
          <p className="mt-2 text-white/70 text-xs text-center leading-relaxed">Get access to all AstroVed services</p>
        </div>
        {/* Right panel */}
        <div className="flex-1 bg-white flex flex-col items-center justify-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6869F9]"></div>
          <p className="mt-4 text-[#6869F9] text-sm font-medium">Configuring secure login...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-2xl overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(104,105,249,0.25)] flex"
      style={{ minHeight: 480 }}
    >
      {/* ── Left branded panel (matches Sri Mandir orange panel style) ── */}
      <div
        className="hidden md:flex w-[220px] flex-shrink-0 flex-col items-start justify-between p-8"
        style={{ background: "linear-gradient(145deg, #6869F9 0%, #4546d4 100%)" }}
      >
        <div>
          <AstroVedMark size={52} />
          <h2 className="mt-5 text-white font-bold text-2xl leading-tight">
            {isAdmin ? "Admin Login" : "Login"}
          </h2>
          <p className="mt-3 text-white/80 text-sm leading-relaxed">
            {isAdmin
              ? "Access the administrative control center."
              : "Get access to all\nAstroVed services,\n1000+ devotional music\nand other items"}
          </p>
        </div>
        <div className="mt-8 space-y-1.5">
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Secure & Encrypted
          </div>
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            OTP Verification
          </div>
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Privacy Protected
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 bg-white p-8 sm:p-10 flex flex-col">
        {/* Logo on mobile */}
        <div className="flex md:hidden items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(145deg, #6869F9, #4546d4)" }}>
            <AstroVedMark size={32} />
          </div>
          <span className="font-bold text-[#2e1b53] text-lg">AstroVed</span>
        </div>

        {/* Logo circle (like Sri Mandir modal) */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(145deg, #6869F9 0%, #4546d4 100%)" }}
          >
            <AstroVedMark size={44} />
          </div>
          <span className="mt-2 font-bold text-[#6869F9] text-base tracking-tight">AstroVed</span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-xl font-bold text-[#1a1a2e] leading-snug">
          {isAdmin
            ? "Admin Login"
            : isIndian
              ? "Login to continue"
              : "Login to continue your booking"}
        </h1>
        <p className="mt-1.5 text-center text-sm text-[#6a4e95]">
          {isAdmin
            ? "Access the administrative control center."
            : isIndian
              ? "We will send an OTP to your WhatsApp number"
              : "All booking updates will be sent to your email"}
        </p>

        {/* Method tabs — only shown if not admin */}
        {!isAdmin && (
          <div className="mt-5 flex rounded-xl bg-[#f3f0ff] p-1">
            {isIndian ? (
              // Indian user: WhatsApp only (matching the original phone tab style)
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all text-[#6869F9] bg-white shadow-sm"
              >
                <WhatsappIcon />
                WhatsApp OTP
              </button>
            ) : (
              // Foreign user: Email only
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all text-[#6869F9] bg-white shadow-sm"
              >
                <MailIcon />
                Email OTP
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 flex-1 flex flex-col">
          <div>
            <label className="block text-sm font-medium text-[#5a3b8a] mb-1.5">
              {method === "email" ? "Email" : "WhatsApp Number"}
            </label>
            <div className="flex items-center rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 transition-all duration-300 focus-within:border-[#6869F9] focus-within:ring-2 focus-within:ring-[#ddd1ff]">
              {method !== "email" && (
                <span className="mr-2 text-sm font-semibold text-[#6869F9] bg-[#eee9ff] px-2 py-0.5 rounded-md">
                  +{DEFAULT_COUNTRY.dialCode}
                </span>
              )}
              <input
                id="login-input"
                type={method === "email" ? "email" : "tel"}
                inputMode={method === "email" ? "email" : "numeric"}
                autoComplete={method === "email" ? "email" : "tel"}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-base text-[#342151] outline-none placeholder:text-[#a288cf]"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => setValue("")}
                  className="ml-2 text-[#a288cf] hover:text-[#6869F9] transition-colors"
                  aria-label="Clear input"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {method === "email" && isAdmin && (
            <div>
              <label className="block text-sm font-medium text-[#5a3b8a] mb-1.5">
                Password
              </label>
              <div className="relative flex items-center rounded-xl border border-[#d8c9fb] bg-[#faf8ff] px-4 py-3 transition-all duration-300 focus-within:border-[#6869F9] focus-within:ring-2 focus-within:ring-[#e0dcff]">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-base text-[#342151] outline-none placeholder:text-[#a288cf] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-[#a288cf] hover:text-[#5a3b8a] transition-colors"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          {method === "email" && isAdmin && (
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-[#6869F9] transition-colors duration-300 hover:text-[#5657e8]"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <div className="flex-1" />

          <button
            id="login-submit-btn"
            type="submit"
            disabled={!isValid || loading}
            className={`w-full rounded-xl px-4 py-3.5 text-base font-semibold text-white transition-all duration-500 ${
              isValid && !loading
                ? "shadow-[0_10px_24px_rgba(104,105,249,0.35)] hover:brightness-110"
                : "cursor-not-allowed opacity-50"
            }`}
            style={
              isValid && !loading
                ? { background: "linear-gradient(135deg, #6869F9 0%, #4546d4 100%)" }
                : { background: "#c4b8f0" }
            }
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : isAdmin ? (
              "Sign In"
            ) : (
              "Get OTP"
            )}
          </button>

          <p className="text-center text-xs text-[#9b7ec8]">
            By proceeding you agree to the{" "}
            <Link href="/terms" className="font-semibold text-[#6869F9] hover:underline">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-[#6869F9] hover:underline">
              Privacy Policy
            </Link>{" "}
            of AstroVed
          </p>
        </form>
      </div>
    </div>
  );
}
