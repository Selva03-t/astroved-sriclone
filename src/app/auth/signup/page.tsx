"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const countries = [
  { name: "India", code: "+91", flag: "https://flagcdn.com/w40/in.png" },
  { name: "United States", code: "+1", flag: "https://flagcdn.com/w40/us.png" },
  { name: "United Kingdom", code: "+44", flag: "https://flagcdn.com/w40/gb.png" },
  { name: "Canada", code: "+1", flag: "https://flagcdn.com/w40/ca.png" },
  { name: "Australia", code: "+61", flag: "https://flagcdn.com/w40/au.png" },
  { name: "Germany", code: "+49", flag: "https://flagcdn.com/w40/de.png" },
  { name: "France", code: "+33", flag: "https://flagcdn.com/w40/fr.png" },
  { name: "United Arab Emirates", code: "+971", flag: "https://flagcdn.com/w40/ae.png" },
  { name: "Saudi Arabia", code: "+966", flag: "https://flagcdn.com/w40/sa.png" },
  { name: "Singapore", code: "+65", flag: "https://flagcdn.com/w40/sg.png" },
];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    password: "",
    confirmPassword: "",
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`,
          password: formData.password
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // Redirect to login on success
      window.location.href = "/auth/login";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#fdfaff] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#ede8ff] to-transparent opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#e8e0ff] to-transparent opacity-50 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-xl px-4 py-12">
        <div className="w-full rounded-3xl border border-[#ddcff9] bg-white/95 p-10 shadow-[0_30px_90px_rgba(91,33,182,0.22)] backdrop-blur sm:p-12">
          <h1 className="text-center text-4xl font-semibold tracking-tight text-[#2e1b53]">Create Account</h1>
          <p className="mt-3 text-center text-base text-[#6a4e95]">Join astroved to explore sacred traditions.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5a3b8a]">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5a3b8a]">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff] transition-all"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-[#5a3b8a]">Phone Number</label>
                <div className="mt-2 flex gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="flex h-full items-center gap-2 rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-3 py-3 text-base text-[#342151] outline-none hover:border-[#F47820] focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff] transition-all min-w-[110px]"
                    >
                      <img src={selectedCountry.flag} alt={selectedCountry.name} className="h-4 w-6 object-cover rounded-sm shadow-sm" />
                      <span className="font-medium">{selectedCountry.code}</span>
                      <svg className={`h-4 w-4 text-[#a288cf] transition-transform ${isCountryDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 z-50 mt-2 max-h-60 w-64 overflow-y-auto rounded-xl border border-[#d8c9fb] bg-white p-2 shadow-xl backdrop-blur-md">
                        {countries.map((country) => (
                          <button
                            key={`${country.name}-${country.code}`}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, countryCode: country.code });
                              setIsCountryDropdownOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[#342151] hover:bg-[#f3ecff] transition-colors"
                          >
                            <img src={country.flag} alt={country.name} className="h-3 w-5 object-cover rounded-sm" />
                            <span className="flex-1 font-medium">{country.name}</span>
                            <span className="text-[#6a4e95] font-semibold">{country.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="Enter phone number"
                    className="flex-1 rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5a3b8a]">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5a3b8a]">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] focus:border-[#F47820] focus:ring-2 focus:ring-[#ddd1ff] transition-all"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#F47820] via-[#6869F9] to-[#F47820] px-4 py-3.5 text-base font-semibold text-white shadow-[0_10px_24px_rgba(104,105,249,0.35)] transition-all hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6f53a3]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-[#5657e8] underline decoration-[#9898ff] underline-offset-4 transition-colors duration-300 hover:text-[#4647c4]"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Subtle Pattern */}
      <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" stroke="#6869F9" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M60 20L65 55L100 60L65 65L60 100L55 65L20 60L55 55L60 20Z" fill="#6869F9" />
        </svg>
      </div>
    </main>
  );
}

