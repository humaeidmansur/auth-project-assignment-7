"use client";

import { useSyncExternalStore } from "react";


// Get the current date in English
function getToday() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

// No subscription is needed
function subscribe() {
  return () => {};
}

export default function HeroBanner() {
  const today = useSyncExternalStore(subscribe, getToday, () => "");

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl border border-green-100 bg-[#FCFDFC] px-6 py-10 shadow-sm sm:px-10 md:flex-row md:px-12 md:py-12">
        {/* Left Content */}
        <div className="z-10 w-full md:w-3/5">
          {/* Current Date */}
          <div className="mb-5 inline-flex items-center rounded-full border border-green-100 bg-green-50 px-4 py-2 text-xs font-semibold text-green-800">
            <span>{today || "Today's Market Update"}</span>
          </div>

          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Today&apos;s Market Prices
            <span className="block text-green-700">at a Glance</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            Stay informed about daily market prices. Compare the latest prices
            of rice, lentils, cooking oil, vegetables, fish, meat, and other
            essential products in one place.
          </p>

          {/* CTA Button */}
          <a
            href="#all-products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            Explore All Products
          </a>
        </div>

        {/* Right Illustration */}
        <div className="relative flex h-56 w-full items-center justify-center md:h-64 md:w-2/5">
          <div className="absolute h-48 w-48 rounded-full bg-green-100 sm:h-56 sm:w-56" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-[-12px] flex items-end justify-center gap-1 text-4xl sm:text-5xl">
              <span className="rotate-[-15deg]">🍎</span>
              <span className="translate-y-[-12px]">🥬</span>
              <span className="rotate-[12deg]">🥕</span>
              <span className="translate-y-[-8px]">🍊</span>
            </div>

            <div className="flex h-24 w-52 items-center justify-center rounded-b-[35px] border-x-4 border-b-4 border-amber-800 bg-amber-600 shadow-lg sm:w-60">
              <div className="flex gap-3 text-3xl">
                <span>🥔</span>
                <span>🧅</span>
                <span>🌶️</span>
              </div>
            </div>

            <div className="absolute -bottom-3 h-3 w-56 rounded-full bg-amber-900 sm:w-64" />
          </div>

          <span className="absolute right-8 top-5 text-3xl">✨</span>
          <span className="absolute bottom-5 left-8 text-2xl">🌿</span>
        </div>
      </div>
    </section>
  );
}
