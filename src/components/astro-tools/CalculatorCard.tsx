"use client";

import Link from "next/link";

export interface CalculatorCardProps {
  id: string;
  title: string;
  description: string;
  /** hex color for title + button bg */
  accentHex: string;
  imageUrl: string;
  href: string | null;
  live: boolean;
}

export default function CalculatorCard({
  title,
  description,
  accentHex,
  imageUrl,
  href,
  live,
}: CalculatorCardProps) {
  const card = (
    <div
      className={[
        "relative bg-white rounded-2xl border border-gray-200 overflow-hidden",
        live ? "cursor-pointer" : "cursor-default",
      ].join(" ")}
      style={{ minHeight: 300 }}
    >
      {/* ── Text & button (left column) ── */}
      <div className="relative z-10 flex flex-col gap-3 p-7 pb-8" style={{ maxWidth: "55%" }}>
        <h2 className="text-xl font-bold leading-snug" style={{ color: accentHex }}>
          {title}
        </h2>
        <p className="text-[13.5px] text-gray-500 leading-relaxed">{description}</p>

        {/* Wide pill arrow button — only on live cards */}
        {live && (
          <div className="mt-2">
            <span
              className="inline-flex items-center justify-center gap-1.5 px-5 h-10 rounded-full text-white text-[15px] font-semibold shadow select-none"
              style={{ backgroundColor: accentHex }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        )}
      </div>

      {/* ── Zodiac image — large, bottom-right, partially cropped ── */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        style={{ width: 220, height: 260 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          role="presentation"
          className="w-full h-full object-cover object-left-top"
          style={{
            filter: live ? "none" : "grayscale(100%) brightness(0.55)",
          }}
        />
      </div>
    </div>
  );

  if (live && href) {
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    );
  }
  return <div>{card}</div>;
}
