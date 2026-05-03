"use client";

import LoginMethods from "@/components/auth/LoginMethods";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#fdfaff] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#f3eaff] to-transparent opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#ede4ff] to-transparent opacity-50 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-xl px-4 py-12">
        <LoginMethods />
      </div>

      {/* Subtle Bottom Pattern */}
      <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" stroke="#7c3aed" strokeWidth="2" strokeDasharray="10 10" />
          <circle cx="60" cy="60" r="40" stroke="#7c3aed" strokeWidth="1" />
          <path d="M60 20V40M60 80V100M20 60H40M80 60H100" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </main>
  );
}
