"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_COUNTRY } from "@/lib/auth/countries";
import { authService } from "@/services/authService";
import type { CountryOption, LoginMethod, OtpPayload } from "@/types/auth";
import CountryPhoneField from "@/components/auth/CountryPhoneField";
import PasswordField from "@/components/auth/PasswordField";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{6,15}$/;

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="m5 7 6.2 4.8a1.3 1.3 0 0 0 1.6 0L19 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="M8 2.5h8A2.5 2.5 0 0 1 18.5 5v14A2.5 2.5 0 0 1 16 21.5H8A2.5 2.5 0 0 1 5.5 19V5A2.5 2.5 0 0 1 8 2.5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.5 5.5h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 flex-shrink-0">
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

function buildOtpPayload(method: LoginMethod, country: CountryOption, phone: string, whatsapp: string): OtpPayload {
  return {
    method: method === "whatsapp" ? "whatsapp" : "phone",
    country,
    number: method === "whatsapp" ? whatsapp : phone,
  };
}

export default function LoginMethods() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get("role");
  const isAdminMode = roleParam === "admin";

  const initialMethod = isAdminMode
    ? "email"
    : ((searchParams?.get("method") as LoginMethod | null) ?? "email");

  const [method, setMethod] = useState<LoginMethod>(initialMethod);
  const [country, setCountry] = useState<CountryOption>(DEFAULT_COUNTRY);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdminMode) return;

    let cancelled = false;
    fetch("/api/admin/login-prefill")
      .then((res) => (res.ok ? res.json() : { email: "" }))
      .then((data: { email?: string }) => {
        if (!cancelled && data.email) setEmail(data.email);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isAdminMode]);

  const isValid = useMemo(() => {
    if (method === "email") return emailRegex.test(email) && password.length > 0;
    if (method === "phone") return phoneRegex.test(phone);
    return phoneRegex.test(whatsapp);
  }, [method, email, password, phone, whatsapp]);

  const redirectAfterLogin = () => {
    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl") || "/dashboard";
    window.location.href = callbackUrl;
  };

  const selectMethod = (nextMethod: LoginMethod) => {
    setMethod(nextMethod);
    setError("");
  };

  const setNumberValue = (nextValue: string) => {
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

    if (!isValid) {
      setError(method === "email" ? "Enter your email and password" : "Enter a valid number");
      return;
    }

    setLoading(true);

    try {
      if (method === "email") {
        const normalizedEmail = email.toLowerCase().trim();

        // If explicitly in admin mode, only try admin login.
        if (isAdminMode) {
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: normalizedEmail, password }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({} as { error?: string }));
            setError(data.error || "Login failed");
            return;
          }

          window.location.href = "/admin";
          return;
        }

        // Normal mode: first try user login. If credentials don't match any user,
        // fall back to admin login using the same email/password form.
        try {
          await authService.loginWithEmail({ email: normalizedEmail, password });
          redirectAfterLogin();
          return;
        } catch {
          // Ignore and try admin login fallback.
        }

        const adminRes = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password }),
        });

        if (adminRes.ok) {
          window.location.href = "/admin";
          return;
        }

        const adminData = await adminRes.json().catch(() => ({} as { error?: string }));
        setError(adminData.error || "Invalid email or password");
        return;
      }

      const payload = buildOtpPayload(method, country, phone, whatsapp);
      await authService.sendOtp(payload);
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set("method", payload.method);
      nextParams.set("country", payload.country.isoCode);
      nextParams.set("number", payload.number);
      router.push(`/auth/otp?${nextParams.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const numberValue = method === "whatsapp" ? whatsapp : phone;
  const numberLabel = method === "whatsapp" ? "WhatsApp Number" : "Phone Number";
  const availableTabs: LoginMethod[] = isAdminMode ? ["email"] : ["email", "phone", "whatsapp"];

  return (
    <div className="w-full max-w-xl rounded-3xl border border-[#ddcff9] bg-white/95 p-10 shadow-[0_30px_90px_rgba(91,33,182,0.22)] backdrop-blur sm:p-12">
      <h1 className="text-center text-4xl font-semibold tracking-tight text-[#2e1b53]">Welcome back</h1>
      <p className="mt-3 text-center text-base text-[#6a4e95]">
        Choose one method to sign in securely.
      </p>

      <div
        className={`mt-8 grid gap-3 rounded-2xl bg-[#f3ecff] p-3 ${
          isAdminMode ? "grid-cols-1" : "grid-cols-3"
        }`}
      >
        {availableTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => selectMethod(tab)}
            className={`flex transform-gpu items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
              method === tab
                ? "bg-gradient-to-r from-[#F47820] to-[#6869F9] text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)]"
                : "text-[#6e52a0] hover:-translate-y-0.5 hover:bg-[#e8ddff] hover:text-[#4e2b86] hover:shadow-[0_6px_16px_rgba(124,58,237,0.14)]"
            }`}
          >
            {tab === "email" && <MailIcon />}
            {tab === "phone" && <PhoneIcon />}
            {tab === "whatsapp" && <WhatsappIcon />}
            <span>{tab === "whatsapp" ? "WhatsApp" : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {method === "email" ? (
          <>
            <label className="block text-sm font-medium text-[#5a3b8a]">
              Email Address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] transition-all focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff]"
              />
            </label>

            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              autoComplete="current-password"
              inputClassName="box-border h-12 w-full rounded-xl border border-[#d8c9fb] bg-[#faf8ff] px-4 py-0 pl-4 pr-12 text-base leading-normal text-[#342151] outline-none placeholder:text-[#a288cf] transition-all focus:border-[#6869F9] focus:ring-2 focus:ring-[#e0dcff]"
            />
          </>
        ) : (
          <>
            <CountryPhoneField
              label={numberLabel}
              value={numberValue}
              onChange={(nextDigits) => setNumberValue(nextDigits)}
              country={country}
              onCountryChange={(nextCountry) => setCountry(nextCountry)}
              placeholder={`Enter your ${method === "whatsapp" ? "WhatsApp" : "phone"} number`}
            />
          </>
        )}

        {error && <p className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-500">{error}</p>}

        {method === "email" && (
          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm font-medium text-[#5657e8] transition-colors duration-300 hover:text-[#4647c4]">
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full rounded-xl px-4 py-3.5 text-base font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isValid && !loading
              ? "bg-gradient-to-r from-[#6869F9] via-[#6869F9] to-[#5657e8] shadow-[0_10px_24px_rgba(104,105,249,0.35)] hover:brightness-110"
              : "cursor-not-allowed bg-[#d2c2ef]"
          }`}
        >
          {loading ? "Please wait..." : method === "email" ? "Log in" : "Send OTP"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-[#7a5ea8]">
        {method === "email"
          ? "Your password is verified securely on the server."
          : "We will send a one-time verification code to your selected number."}
      </p>

      <p className="mt-5 text-center text-sm text-[#6f53a3]">
        New to astroved?{" "}
        <Link href="/auth/signup" className="font-semibold text-[#5657e8] underline decoration-[#9898ff] underline-offset-4 transition-colors duration-300 hover:text-[#4647c4]">
          Register now
        </Link>
      </p>

      {/* No separate admin sign-in section: /admin/login redirects into this shared form */}
    </div>
  );
}
