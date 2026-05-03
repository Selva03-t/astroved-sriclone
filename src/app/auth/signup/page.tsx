"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#f3eaff] to-transparent opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#ede4ff] to-transparent opacity-50 blur-3xl pointer-events-none" />
      
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
                  className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#ddd1ff] transition-all"
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
                  className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#ddd1ff] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5a3b8a]">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#ddd1ff] transition-all"
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
                  className="mt-2 w-full rounded-xl border border-[#d8c9fb] bg-[#fcfaff] px-4 py-3 text-base text-[#342151] outline-none placeholder:text-[#a288cf] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#ddd1ff] transition-all"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] px-4 py-3.5 text-base font-semibold text-white shadow-[0_10px_24px_rgba(124,58,237,0.35)] transition-all hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6f53a3]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-[#6d28d9] underline decoration-[#a78bfa] underline-offset-4 transition-colors duration-300 hover:text-[#4c1d95]"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Subtle Pattern */}
      <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" stroke="#7c3aed" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M60 20L65 55L100 60L65 65L60 100L55 65L20 60L55 55L60 20Z" fill="#7c3aed" />
        </svg>
      </div>
    </main>
  );
}
