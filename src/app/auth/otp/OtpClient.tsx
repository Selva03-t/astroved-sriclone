"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCountryByIsoCode } from "@/lib/auth/countries";
import { authService } from "@/services/authService";
import type { LoginMethod, OtpPayload } from "@/types/auth";

const RESEND_SECONDS = 30;

function parseOtpContext(params: URLSearchParams): OtpPayload | null {
  const method = params.get("method") as LoginMethod | null;
  const isoCode = params.get("country") ?? "";
  const number = (params.get("number") ?? "").replace(/[^0-9]/g, "");

  if (method !== "phone" && method !== "whatsapp") return null;
  if (!isoCode || !number) return null;

  const country = getCountryByIsoCode(isoCode);

  return {
    method,
    country,
    number,
  };
}

export default function OtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const otpPayload = useMemo(() => {
    if (!searchParams) return null;
    return parseOtpContext(new URLSearchParams(searchParams.toString()));
  }, [searchParams]);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    otpRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  const redirectAfterLogin = () => {
    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl") || "/dashboard";
    window.location.href = callbackUrl;
  };

  const handleOtpChange = (index: number, nextValue: string) => {
    const digit = nextValue.replace(/[^0-9]/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!otpPayload) {
      setError("Missing OTP session. Please try again.");
      return;
    }

    const otpValue = otp.join("");
    if (!/^[0-9]{6}$/.test(otpValue)) {
      setError("Enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp({ ...otpPayload, otp: otpValue });
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
      await authService.resendOtp(otpPayload);
      setOtp(Array(6).fill(""));
      setResendSeconds(RESEND_SECONDS);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    const method = otpPayload?.method ?? "phone";
    router.push(`/auth/login?method=${encodeURIComponent(method)}`);
  };

  const summary = otpPayload
    ? `OTP sent to +${otpPayload.country.dialCode} ${otpPayload.number}`
    : "We couldn’t load your OTP session. Please go back and request a new OTP.";

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#fdfaff]">
      <div className="pointer-events-none absolute right-0 top-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3 rounded-full bg-linear-to-br from-[#ede8ff] to-transparent opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/2 rounded-full bg-linear-to-tr from-[#e8e0ff] to-transparent opacity-50 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl px-4 py-12">
        <div className="w-full rounded-3xl border border-[#ddcff9] bg-white/95 p-10 shadow-[0_30px_90px_rgba(91,33,182,0.22)] backdrop-blur sm:p-12">
          <h1 className="text-center text-4xl font-semibold tracking-tight text-[#2e1b53]">Verify OTP</h1>
          <p className="mt-3 text-center text-base text-[#6a4e95]">Enter the 6-digit code to continue.</p>

          <div className="mt-8 rounded-2xl border border-[#e1d5fb] bg-[#fcfaff] p-4 text-center text-sm text-[#6a4e95]">
            {summary}
          </div>

          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
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
                  className="aspect-square w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] text-center text-xl font-semibold text-[#342151] outline-none transition-all focus:border-[#6869F9] focus:ring-2 focus:ring-[#ddd1ff]"
                />
              ))}
            </div>

            {error && <p className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6 || !otpPayload}
              className="w-full rounded-xl bg-linear-to-r from-[#6869F9] to-[#5657e8] px-4 py-3.5 text-base font-semibold text-white shadow-[0_10px_24px_rgba(104,105,249,0.35)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:bg-[#d2c2ef] disabled:bg-none disabled:shadow-none"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="flex flex-col items-center justify-between gap-3 text-sm text-[#6f53a3] sm:flex-row">
              <button
                type="button"
                onClick={handleChangeNumber}
                className="font-semibold text-[#6869F9] transition-colors hover:text-[#5657e8]"
              >
                Change number
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendSeconds > 0 || loading || !otpPayload}
                className="font-semibold text-[#6869F9] transition-colors hover:text-[#5657e8] disabled:cursor-not-allowed disabled:text-[#a288cf]"
              >
                {resendSeconds > 0 ? `Resend OTP in ${resendSeconds}s` : "Resend OTP"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-[#6f53a3]">
            Want to use email instead?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-[#6869F9] underline decoration-[#9898ff] underline-offset-4 transition-colors duration-300 hover:text-[#5657e8]"
            >
              Go to login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}


