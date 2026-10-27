"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

export type Slide = {
  slug: string;
  kicker: string;
  title: string;
  tagline: string;
  image: string;
};

const INTERVAL_MS = 6000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

// Full-screen category slideshow, one photo per category. Autoplays unless the
// visitor prefers reduced motion; the pause control satisfies WCAG 2.2.2.
export function CategorySlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
  // null until the visitor presses play/pause; until then motion preference decides.
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reducedMotion;

  useEffect(() => {
    if (!playing || hovered || slides.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [playing, hovered, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Our products"
      className="relative h-[calc(100svh-4rem)] min-h-[520px] max-h-[900px] overflow-hidden bg-navy"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.slug}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}, ${s.title}`}
            aria-hidden={!active}
            inert={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none ${active ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={s.image}
              alt=""
              fill
              sizes="100vw"
              preload={i === 0}
              className={`object-cover transition-transform duration-[7000ms] ease-out motion-reduce:transition-none ${active ? "scale-105" : "scale-100"}`}
            />
            <div className="absolute inset-0 bg-linear-to-r from-navy/85 via-navy/50 to-navy/10" />
            <div className="relative mx-auto flex h-full w-full max-w-[1280px] flex-col justify-center px-4 md:px-6">
              <p className="m-0 font-semibold uppercase tracking-[0.25em] text-teal-bright text-[15px] sm:text-[18px]">{s.kicker}</p>
              <h2 className="mt-2 max-w-[14ch] text-white text-[clamp(3rem,2rem+5vw,6.5rem)] leading-[0.95]">{s.title}</h2>
              <p className="mt-5 max-w-[34ch] text-white/90 text-[1.2rem]">{s.tagline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/products/${s.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border-2 border-teal-bright px-7 font-semibold uppercase tracking-[0.15em] text-[15px] text-white no-underline transition-colors duration-[var(--dur-micro)] hover:bg-teal-bright hover:text-navy"
                >
                  Discover
                </Link>
                <Link
                  href={`/contact?category=${s.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full bg-teal px-7 font-semibold text-white no-underline transition-colors duration-[var(--dur-micro)] hover:bg-teal-hover"
                >
                  Get a quote
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-24 flex items-center justify-center sm:bottom-6 sm:gap-3 lg:inset-x-auto lg:bottom-auto lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col">
        {slides.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.title}`}
            aria-current={i === index}
            className="group grid h-11 w-11 cursor-pointer place-items-center"
          >
            <span className={`block rounded-full transition-all duration-[var(--dur-component)] ${i === index ? "h-3.5 w-3.5 bg-teal-bright" : "h-2.5 w-2.5 bg-white/60 group-hover:bg-white"}`} />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setUserPlaying(!playing)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          className="grid h-11 w-11 cursor-pointer place-items-center text-white/80 hover:text-white"
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            {playing ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>
      </div>
    </section>
  );
}
