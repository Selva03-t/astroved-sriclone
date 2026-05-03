"use client";

import Navbar from "@/components/layout/Navbar";
import NakshatraCard from "@/components/NakshatraCard";

export default function NakshatraFinderPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8fafc] py-12">
        <div className="mx-auto max-w-5xl px-6">
          <section className="mb-8 rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 px-8 py-10 text-white shadow-lg">
            <h1 className="text-center text-4xl font-extrabold">Nakshatra Finder</h1>
            <p className="mx-auto mt-3 max-w-2xl text-center text-base text-green-50">
              Enter your date and time of birth to view Janma Nakshatra details instantly.
            </p>
          </section>

          <section className="mx-auto max-w-3xl">
            <NakshatraCard hideHeader />
          </section>
        </div>
      </main>
    </>
  );
}
