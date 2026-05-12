"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY, getCountryByIsoCode } from "@/lib/auth/countries";
import { loginWithEmail, resendOtp, sendOtp, verifyOtp } from "@/lib/api/auth";
import type { CountryOption, LoginMethod, OtpPayload } from "@/types/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{6,15}$/;
const RESEND_SECONDS = 30;

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
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="M12 3.5A8.5 8.5 0 0 0 4.8 16.7L3.5 20.5l3.9-1.2A8.5 8.5 0 1 0 12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.3 8.8c.2-.5.5-.5.7-.5.2 0 .4 0 .6.5.2.6.7 1.6.8 1.7.1.1.1.2 0 .4-.1.2-.2.4-.3.5-.1.1-.2.2-.3.4-.1.1-.2.3 0 .5.2.2.7 1.2 1.8 1.9 1.4.9 2 .8 2.3.7.4-.1 1.2-1.1 1.3-1.5.1-.3.2-.3.3-.3.1 0 1 .4 1.2.5.2.1.3.2.3.3 0 .1-.2 1.1-.9 1.8-.8.8-1.9 1.2-2.6 1.1-.7-.1-2.1-.5-3.8-2.1-1.9-1.7-2.4-3.3-2.5-4.1-.1-.8.3-1.6.8-2.1Z" fill="currentColor" />
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
  const [method, setMethod] = useState<LoginMethod>("email");
  const [country, setCountry] = useState<CountryOption>(DEFAULT_COUNTRY);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpPayload, setOtpPayload] = useState<OtpPayload | null>(null);
  const [isOtpScreen, setIsOtpScreen] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!isOtpScreen || resendSeconds <= 0) return;

    const timer = window.setTimeout(() => setResendSeconds((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [isOtpScreen, resendSeconds]);

  useEffect(() => {
    if (isOtpScreen) otpRefs.current[0]?.focus();
  }, [isOtpScreen]);

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
    setIsOtpScreen(false);
    setOtp(Array(6).fill(""));
    setOtpPayload(null);
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
        await loginWithEmail({ email, password });
        redirectAfterLogin();
        return;
      }

      const payload = buildOtpPayload(method, country, phone, whatsapp);
      await sendOtp(payload);
      setOtpPayload(payload);
      setOtp(Array(6).fill(""));
      setResendSeconds(RESEND_SECONDS);
      setIsOtpScreen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, nextValue: string) => {
    const digit = nextValue.replace(/[^0-9]/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!otpPayload) return;

    const otpValue = otp.join("");
    if (!/^[0-9]{6}$/.test(otpValue)) {
      setError("Enter the 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp({ ...otpPayload, otp: otpValue });
      redirectAfterLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!otpPayload || resendSeconds > 0) return;

    setError("");
    setLoading(true);

    try {
      await resendOtp(otpPayload);
      setOtp(Array(6).fill(""));
      setResendSeconds(RESEND_SECONDS);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const numberValue = method === "whatsapp" ? whatsapp : phone;
  const numberLabel = method === "whatsapp" ? "WhatsApp Number" : "Phone Number";

  return (
    <div className="w-full max-w-xl rounded-3xl border border-[#ddcff9] bg-white/95 p-10 shadow-[0_30px_90px_rgba(91,33,182,0.22)] backdrop-blur sm:p-12">
      <h1 className="text-center text-4xl font-semibold tracking-tight text-[#2e1b53]">Welcome back</h1>
      <p className="mt-3 text-center text-base text-[#6a4e95]">
        {isOtpScreen ? "Verify your one-time password to continue." : "Choose one method to sign in securely."}
      </p>

      {!isOtpScreen && (
        <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl bg-[#f3ecff] p-3">
          {(["email", "phone", "whatsapp"] as LoginMethod[]).map((tab) => (
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
      )}

      {isOtpScreen && otpPayload ? (
        <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
          <div className="rounded-2xl border border-[#e1d5fb] bg-[#fcfaff] p-4 text-center text-sm text-[#6a4e95]">
            OTP sent to +{otpPayload.country.dialCode} {otpPayload.number}
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  otpRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                className="aspect-square w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] text-center text-xl font-semibold text-[#342151] outline-none transition-all focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff]"
              />
            ))}
          </div>

          {error && <p className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full rounded-xl bg-gradient-to-r from-[#6869F9] via-[#6869F9] to-[#5657e8] px-4 py-3.5 text-base font-semibold text-white shadow-[0_10px_24px_rgba(104,105,249,0.35)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:bg-[#d2c2ef] disabled:bg-none disabled:shadow-none"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="flex flex-col items-center justify-between gap-3 text-sm text-[#6f53a3] sm:flex-row">
            <button type="button" onClick={() => setIsOtpScreen(false)} className="font-semibold text-[#5657e8] transition-colors hover:text-[#4647c4]">
              Change number
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendSeconds > 0 || loading}
              className="font-semibold text-[#5657e8] transition-colors hover:text-[#4647c4] disabled:cursor-not-allowed disabled:text-[#a288cf]"
            >
              {resendSeconds > 0 ? `Resend OTP in ${resendSeconds}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      ) : (
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

              <label className="block text-sm font-medium text-[#5a3b8a]">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#faf8ff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] transition-all focus:border-[#6869F9] focus:ring-2 focus:ring-[#e0dcff]"
                />
              </label>
            </>
          ) : (
            <>
              <label className="block text-sm font-medium text-[#5a3b8a]">
                Country Code
                <select
                  value={country.isoCode}
                  onChange={(event) => setCountry(getCountryByIsoCode(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none transition-all focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff]"
                >
                  {COUNTRIES.map((countryOption) => (
                    <option key={countryOption.isoCode} value={countryOption.isoCode}>
                      {countryOption.name} (+{countryOption.dialCode})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-[#5a3b8a]">
                {numberLabel}
                <div className="mt-2 flex items-center rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 transition-all focus-within:border-[#F47820] focus-within:ring-2 focus-within:ring-[#ddd1ff]">
                  <span className="mr-3 text-base text-[#7b5db5]">+{country.dialCode}</span>
                  <input
                    type="tel"
                    value={numberValue}
                    onChange={(event) => setNumberValue(event.target.value)}
                    placeholder={`Enter your ${method === "whatsapp" ? "WhatsApp" : "phone"} number`}
                    className="w-full bg-transparent text-base text-[#342151] outline-none placeholder:text-[#a288cf]"
                  />
                </div>
              </label>
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
      )}

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
    </div>
  );
}
