"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/auth/countries";
import { authService } from "@/services/authService";
import type { SignupPayload } from "@/types/auth";
import CountryPhoneField from "@/components/auth/CountryPhoneField";
import PasswordField from "@/components/auth/PasswordField";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{6,15}$/;

function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Za-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.filter(Boolean).length;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupPayload>({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    country: DEFAULT_COUNTRY,
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [separateWhatsapp, setSeparateWhatsapp] = useState(false);
  const passwordStrength = getPasswordStrength(formData.password);

  const isFormValid = useMemo(() => {
    const whatsappOk = !separateWhatsapp || phoneRegex.test(formData.whatsapp ?? "");
    return (
      formData.name.trim().length > 1 &&
      emailRegex.test(formData.email) &&
      phoneRegex.test(formData.phone) &&
      whatsappOk &&
      passwordStrength >= 3 &&
      formData.password === formData.confirmPassword
    );
  }, [formData, passwordStrength, separateWhatsapp]);

  const updateField = <K extends keyof SignupPayload>(key: K, value: SignupPayload[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Full name is required";
    if (!emailRegex.test(formData.email)) return "Enter a valid email address";
    if (!phoneRegex.test(formData.phone)) return "Enter a valid mobile number";
    if (separateWhatsapp && !phoneRegex.test(formData.whatsapp ?? "")) return "Enter a valid WhatsApp number";
    if (passwordStrength < 3) return "Password must be at least 8 characters and include a letter and a number";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = formData.email.toLowerCase().trim();
      const trimmedName = formData.name.trim();
      await authService.signupUser({
        ...formData,
        email: normalizedEmail,
        name: trimmedName,
        whatsapp: separateWhatsapp ? (formData.whatsapp ?? "").replace(/[^0-9]/g, "") : "",
      });

      window.location.href = "/auth/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#fdfaff]">
      <div className="pointer-events-none absolute right-0 top-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3 rounded-full bg-gradient-to-br from-[#ede8ff] to-transparent opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/2 rounded-full bg-gradient-to-tr from-[#e8e0ff] to-transparent opacity-50 blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl px-4 py-12">
        <div className="w-full rounded-3xl border border-[#ddcff9] bg-white/95 p-8 shadow-[0_30px_90px_rgba(91,33,182,0.22)] backdrop-blur sm:p-12">
          <h1 className="text-center text-4xl font-semibold tracking-tight text-[#2e1b53]">Create Account</h1>
          <p className="mt-3 text-center text-base text-[#6a4e95]">Join astroved to explore sacred traditions.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[#5a3b8a] sm:col-span-2">
                Full Name
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2 box-border h-12 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 text-base text-[#342151] outline-none placeholder:text-[#a288cf] transition-all focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff]"
                />
              </label>

              <label className="block text-sm font-medium text-[#5a3b8a] sm:col-span-2">
                Email Address
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="Enter your email"
                  className="mt-2 box-border h-12 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 text-base text-[#342151] outline-none placeholder:text-[#a288cf] transition-all focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff]"
                />
              </label>

              <label className="block text-sm font-medium text-[#5a3b8a] sm:col-span-2">
                Country
                <input
                  type="text"
                  list="astroved-country-list"
                  value={formData.country.name}
                  onChange={(event) => {
                    const nextName = event.target.value;
                    const match = COUNTRIES.find((c) => c.name.toLowerCase() === nextName.toLowerCase());
                    if (match) {
                      updateField("country", match);
                      return;
                    }
                    // Keep user's typed text visible while they search; do not mutate country object.
                    updateField("country", { ...formData.country, name: nextName });
                  }}
                  placeholder="Enter your country"
                  className="mt-2 box-border h-12 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 text-base text-[#342151] outline-none placeholder:text-[#a288cf] transition-all focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff]"
                />
                <datalist id="astroved-country-list">
                  {COUNTRIES.map((c, idx) => (
                    <option key={`${c.isoCode}-${c.dialCode}-${idx}`} value={c.name} />
                  ))}
                </datalist>
              </label>

              <CountryPhoneField
                label="Mobile Number"
                value={formData.phone}
                onChange={(nextDigits) => updateField("phone", nextDigits)}
                country={formData.country}
                onCountryChange={(nextCountry) => updateField("country", nextCountry)}
                placeholder="Mobile number"
                className="sm:col-span-2"
              />

              <div className="flex items-start gap-3 sm:col-span-2">
                <input
                  id="separate-whatsapp"
                  type="checkbox"
                  checked={separateWhatsapp}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setSeparateWhatsapp(on);
                    if (!on) updateField("whatsapp", "");
                  }}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-[#d8c9fb] text-[#6869F9] focus:ring-[#ddd1ff]"
                />
                <label htmlFor="separate-whatsapp" className="text-sm font-medium text-[#5a3b8a] leading-snug cursor-pointer">
                  Enter the whatsapp number
                </label>
              </div>

              {separateWhatsapp && (
                <CountryPhoneField
                  label="WhatsApp Number"
                  value={formData.whatsapp ?? ""}
                  onChange={(nextDigits) => updateField("whatsapp", nextDigits)}
                  country={formData.country}
                  onCountryChange={(nextCountry) => updateField("country", nextCountry)}
                  placeholder="WhatsApp number"
                  className="sm:col-span-2"
                />
              )}

              <div className="flex w-full flex-col gap-4 sm:col-span-2">
                <PasswordField
                  className="w-full"
                  label="Password"
                  value={formData.password}
                  onChange={(v) => updateField("password", v)}
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
                />
                <PasswordField
                  className="w-full"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(v) => updateField("confirmPassword", v)}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="rounded-xl bg-[#f7f2ff] p-3 text-xs text-[#6f53a3]">
              Password strength:{" "}
              <span className="font-semibold text-[#5657e8]">
                {passwordStrength >= 4 ? "Strong" : passwordStrength >= 3 ? "Good" : "Needs letter, number, and 8 characters"}
              </span>
            </div>

            {error && <p className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#F47820] via-[#6869F9] to-[#F47820] px-4 py-3.5 text-base font-semibold text-white shadow-[0_10px_24px_rgba(104,105,249,0.35)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:bg-[#d2c2ef] disabled:bg-none disabled:shadow-none"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6f53a3]">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-[#5657e8] underline decoration-[#9898ff] underline-offset-4 transition-colors duration-300 hover:text-[#4647c4]">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-10 right-10 opacity-10">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" stroke="#6869F9" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M60 20L65 55L100 60L65 65L60 100L55 65L20 60L55 55L60 20Z" fill="#6869F9" />
        </svg>
      </div>
    </main>
  );
}
