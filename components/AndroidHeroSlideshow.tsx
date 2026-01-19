"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

type AndroidHeroSlideshowProps = {
  className?: string;
};

const SLIDES = ["/slide1.png", "/slide2.png", "/slide3.png", "/slide4.png"] as const;
const HOLD_MS = 4000;
const FADE_MS = 1200;
const VIDEO_WARM_KEY = "cvad:bgVideoWarm:v1";
const VIDEO_DISABLED_EVENT = "cvad:bgVideoDisabled";

export default function AndroidHeroSlideshow({ className = "" }: AndroidHeroSlideshowProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.sessionStorage.setItem(VIDEO_WARM_KEY, "1");
    } catch {
      // ignore
    }

    window.dispatchEvent(new Event(VIDEO_DISABLED_EVENT));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const startLoop = () => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
      intervalRef.current = window.setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % SLIDES.length);
      }, HOLD_MS + FADE_MS);
    };

    timeoutRef.current = window.setTimeout(startLoop, HOLD_MS);

    return () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
      if (intervalRef.current != null) window.clearInterval(intervalRef.current);
      timeoutRef.current = null;
      intervalRef.current = null;
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 ${className}`.trim()} aria-hidden="true">
        <Image
          src={SLIDES[0]}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 ${className}`.trim()} aria-hidden="true">
      {SLIDES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          className={
            "absolute inset-0 object-cover transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none " +
            (index === activeIndex ? "opacity-100" : "opacity-0")
          }
        />
      ))}
    </div>
  );
}
