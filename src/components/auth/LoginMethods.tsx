"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M8 2.5h8A2.5 2.5 0 0 1 18.5 5v14A2.5 2.5 0 0 1 16 21.5H8A2.5 2.5 0 0 1 5.5 19V5A2.5 2.5 0 0 1 8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M10.5 5.5h3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12 3.5A8.5 8.5 0 0 0 4.8 16.7L3.5 20.5l3.9-1.2A8.5 8.5 0 1 0 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 8.8c.2-.5.5-.5.7-.5.2 0 .4 0 .6.5.2.6.7 1.6.8 1.7.1.1.1.2 0 .4-.1.2-.2.4-.3.5-.1.1-.2.2-.3.4-.1.1-.2.3 0 .5.2.2.7 1.2 1.8 1.9 1.4.9 2 .8 2.3.7.4-.1 1.2-1.1 1.3-1.5.1-.3.2-.3.3-.3.1 0 1 .4 1.2.5.2.1.3.2.3.3 0 .1-.2 1.1-.9 1.8-.8.8-1.9 1.2-2.6 1.1-.7-.1-2.1-.5-3.8-2.1-1.9-1.7-2.4-3.3-2.5-4.1-.1-.8.3-1.6.8-2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LoginMethods() {
  const [method, setMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValid = useMemo(() => {
    if (method === "email") return emailRegex.test(email) && password.length > 0;
    if (method === "phone") return phoneRegex.test(phone);
    return phoneRegex.test(whatsapp);
  }, [method, email, phone, whatsapp]);

  const placeholder =
    method === "email"
      ? "Enter your email"
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
      if (method === "email") {
        const data = await authService.loginWithEmail({ email, password });

        if (data.isAdmin) {
         window.location.href = "/admin";
         return;
        }

        const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl") || "/dashboard";
        window.location.href = callbackUrl;
        return;
      }

      const number = method === "phone" ? phone : whatsapp;
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

  return (
    <div className="w-full max-w-xl rounded-3xl border border-[#ddcff9] bg-white/95 p-10 shadow-[0_30px_90px_rgba(91,33,182,0.22)] backdrop-blur sm:p-12">
      <h1 className="text-center text-4xl font-semibold tracking-tight text-[#2e1b53]">Welcome back</h1>
      <p className="mt-3 text-center text-base text-[#6a4e95]">Choose one method to sign in securely.</p>

      <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl bg-[#f3ecff] p-3">
        <button
          type="button"
          onClick={() => setMethod("email")}
          className={`transform-gpu will-change-transform flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            method === "email"
              ? "bg-gradient-to-r from-[#F47820] to-[#1f1f1f] text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)]"
              : "text-[#6e52a0] hover:-translate-y-0.5 hover:bg-[#e8ddff] hover:text-[#4e2b86] hover:shadow-[0_6px_16px_rgba(124,58,237,0.14)]"
          }`}
        >
          <MailIcon />
          <span>Email</span>
        </button>

        <button
          type="button"
          onClick={() => setMethod("phone")}
          className={`transform-gpu will-change-transform flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            method === "phone"
              ? "bg-gradient-to-r from-[#F47820] to-[#1f1f1f] text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)]"
              : "text-[#6e52a0] hover:-translate-y-0.5 hover:bg-[#e8ddff] hover:text-[#4e2b86] hover:shadow-[0_6px_16px_rgba(124,58,237,0.14)]"
          }`}
        >
          <PhoneIcon />
          <span>Phone</span>
        </button>

        <button
          type="button"
          onClick={() => setMethod("whatsapp")}
          className={`transform-gpu will-change-transform flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            method === "whatsapp"
              ? "bg-gradient-to-r from-[#F47820] to-[#1f1f1f] text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)]"
              : "text-[#6e52a0] hover:-translate-y-0.5 hover:bg-[#e8ddff] hover:text-[#4e2b86] hover:shadow-[0_6px_16px_rgba(124,58,237,0.14)]"
          }`}
        >
          <WhatsappIcon />
          <span>WhatsApp</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-[#5a3b8a]">
          {method === "email"
            ? "Email Address"
            : method === "phone"
              ? "Phone Number"
              : "WhatsApp Number"}
          <div className="mt-2 flex items-center rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:border-[#F47820] focus-within:ring-2 focus-within:ring-[#ddd1ff]">
            {(method === "phone" || method === "whatsapp") && (
              <span className="mr-2 text-base text-[#7b5db5]">+{DEFAULT_COUNTRY.dialCode}</span>
            )}
            <input
              type={method === "email" ? "email" : "tel"}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-base text-[#342151] outline-none placeholder:text-[#a288cf]"
            />
          </div>
        </label>

        {method === "email" && (
           <label className="block text-sm font-medium text-[#5a3b8a]">
              Password
              <div className="relative mt-2 flex items-center rounded-xl border border-[#d8c9fb] bg-[#faf8ff] px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:border-[#1f1f1f] focus-within:ring-2 focus-within:ring-[#e0dcff]">
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
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </button>
              </div>
           </label>
        )}

        {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

        {method === "email" && (
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-[#000000] transition-colors duration-300 hover:text-[#4647c4]"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full rounded-xl px-4 py-3.5 text-base font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isValid && !loading
              ? "bg-gradient-to-r from-[#1f1f1f] via-[#1f1f1f] to-[#000000] shadow-[0_10px_24_rgba(104,105,249,0.35)] hover:brightness-110"
              : "cursor-not-allowed bg-[#d2c2ef]"
          }`}
        >
          {loading ? "Logging in..." : "Continue"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-[#7a5ea8]">
        {method === "email"
          ? "We will send a secure login link to your email."
          : "We will send a one-time verification code to your selected number."}
      </p>

      <p className="mt-5 text-center text-sm text-[#6f53a3]">
        New to divinealign?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-[#000000] underline decoration-[#9898ff] underline-offset-4 transition-colors duration-300 hover:text-[#4647c4]"
        >
          Register now
        </Link>
      </p>
    </div>
  );
}
        

