"use client";

import { useState } from "react";

export interface HowItWorksStep {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tag?: string;
  cta?: string;
}

interface HowItWorksCarouselProps {
  title: string;
  steps: HowItWorksStep[];
}

export default function HowItWorksCarousel({ title, steps }: HowItWorksCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = steps[activeIndex];
  const previousStep = steps[(activeIndex - 1 + steps.length) % steps.length];
  const nextStep = steps[(activeIndex + 1) % steps.length];

  const goToPrevious = () => {
    setActiveIndex((index) => (index === 0 ? steps.length - 1 : index - 1));
  };

  const goToNext = () => {
    setActiveIndex((index) => (index === steps.length - 1 ? 0 : index + 1));
  };

  return (
    <section id="how-it-works" className="mt-20">
      <h2 className="mb-10 text-2xl font-bold text-[#1f1f1f] md:text-3xl">
        {title}
      </h2>

      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-10">
          {steps.map((step, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${step.title}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group flex w-full gap-4 text-left"
                aria-label={`Show step ${index + 1}: ${step.title}`}
              >
                <span
                  className={`mt-0.5 flex h-8 w-12 shrink-0 items-center pl-3 text-sm font-black text-white shadow-sm transition-all duration-200 ${
                    isActive ? "bg-[#6869F9]" : "bg-[#ff9a37] group-hover:bg-[#6869F9]"
                  }`}
                  style={{ clipPath: "polygon(0 0, 78% 0, 100% 50%, 78% 100%, 0 100%)" }}
                >
                  {index + 1}
                </span>
                <span>
                  <span className={`block text-xl font-black transition-colors ${isActive ? "text-[#101828]" : "text-[#1f1f1f]"}`}>
                    {step.title}
                  </span>
                  <span className="mt-2 block max-w-2xl text-base leading-7 text-gray-500">
                    {step.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-h-[430px] overflow-hidden rounded-[26px] bg-[#6869F9] px-8 py-10 shadow-[0_18px_48px_rgba(244,120,32,0.24)]">
          <div className="pointer-events-none absolute left-4 top-1/2 hidden w-44 -translate-y-1/2 -translate-x-1/2 overflow-hidden rounded-xl bg-white opacity-55 blur-[1px] md:block">
            <img src={previousStep.imageSrc} alt="" className="h-56 w-full object-cover" />
          </div>
          <div className="pointer-events-none absolute right-4 top-1/2 hidden w-44 -translate-y-1/2 translate-x-1/2 overflow-hidden rounded-xl bg-white opacity-55 blur-[1px] md:block">
            <img src={nextStep.imageSrc} alt="" className="h-56 w-full object-cover" />
          </div>

          <div className="relative z-10 mx-auto max-w-[330px] rounded-xl bg-white p-3 shadow-[0_18px_44px_rgba(111,44,0,0.3)]">
            <div className="overflow-hidden rounded-lg">
              <img
                src={activeStep.imageSrc}
                alt={activeStep.imageAlt}
                className="h-44 w-full object-cover"
              />
            </div>
            <div className="px-2 pb-2 pt-4">
              {activeStep.tag && (
                <span className="rounded bg-[#f5f3ff] px-3 py-1 text-xs font-bold text-[#1f1f1f]">
                  {activeStep.tag}
                </span>
              )}
              <h3 className="mt-4 text-xl font-black leading-tight text-[#1f1f1f]">
                {activeStep.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {activeStep.description}
              </p>
              <button
                type="button"
                className="mt-5 flex w-full items-center justify-center rounded-lg bg-[#6869F9] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#d95f13]"
              >
                {activeStep.cta || activeStep.title}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous how it works step"
            className="absolute left-5 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-lg transition hover:bg-black/65"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path d="m12.5 4.5-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next how it works step"
            className="absolute right-5 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-lg transition hover:bg-black/65"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path d="m7.5 4.5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-3 lg:justify-end lg:pr-[18%]">
        {steps.map((step, index) => (
          <button
            key={`${step.title}-dot`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to how it works step ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-200 ${
              index === activeIndex ? "w-7 bg-[#6869F9]" : "w-2.5 bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

