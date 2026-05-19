import Navbar from "@/components/layout/Navbar";

const features = [
  "Offer puja, deepam, flowers, and sacred prayers from your phone.",
  "Listen to devotional songs, bhajans, mantras, and aartis.",
  "Read Hanuman Chalisa, spiritual stories, and Hindu literature.",
  "Share auspicious wishes and daily blessings with loved ones.",
  "Check Panchang, muhurat, and astrology insights in one place.",
  "Explore Vedic remedies, temple services, and community rituals.",
];

const stats = [
  { value: "25+", label: "Years of Vedic expertise" },
  { value: "100+", label: "Sacred temple connections" },
  { value: "60M+", label: "Lives touched through remedies" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-[#241a46]">
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-start lg:justify-between lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff3eb] text-3xl text-[#F47820] shadow-sm">
                <i className="fa-solid fa-hands-praying" aria-hidden="true"></i>
              </div>
              <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-[#F47820]">
                About DivineAlign
              </p>
              <h1 className="text-4xl font-black leading-tight text-[#16111f] md:text-6xl">
                One spiritual companion for astrology, remedies, and devotion.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">
                DivineAlign helps people connect with Vedic wisdom in a simple digital experience. From astrology tools and Panchang to pujas, devotional content, temple offerings, and remedies, the platform brings trusted spiritual services closer to every home.
              </p>
              <a
                href="#download-app"
                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#F47820] px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-orange-100 transition-all hover:bg-[#d95f13] active:scale-95"
              >
                <i className="fa-solid fa-download" aria-hidden="true"></i>
                Download App
              </a>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-[#ffe3cf] bg-[#fff8f0] p-6 shadow-[0_18px_50px_rgba(244,120,32,0.12)]">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#933913]">What you can do</p>
              <ul className="mt-5 space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-[15px] leading-6 text-[#4b2f24]">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F47820] text-[10px] text-white">
                      <i className="fa-solid fa-check" aria-hidden="true"></i>
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#fafafa] px-6 py-14 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm">
                <p className="text-4xl font-black text-[#6869F9]">{item.value}</p>
                <p className="mt-2 text-sm font-semibold text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-black text-[#16111f]">Built for everyday spiritual practice</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-gray-700">
              Our goal is to make sacred rituals, astrology guidance, and devotional learning accessible without losing the warmth and discipline of tradition. Every service is designed to help devotees participate with clarity, trust, and convenience.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
