"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const GRADIENT = "linear-gradient(135deg, #F6A212 0%, #FFC700 100%)";

function BlackCarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M16 14.5 20.2 8.9c.7-1 1.8-1.6 3-1.6h18.1c1.5 0 2.8.8 3.5 2.1l3 5.1c.4.7.6 1.5.6 2.3V19c0 1.1-.9 2-2 2h-1.9a4.2 4.2 0 0 1-8.2 0H25.9a4.2 4.2 0 0 1-8.2 0H15c-1.1 0-2-.9-2-2v-1.2c0-1.2.5-2.4 1.3-3.3Z"
        fill="#0B0B0B"
      />
      <path
        d="M24 9h16c1.2 0 2.3.6 2.9 1.7l2 3.3H20.2l2.1-3.1C23 9.7 23.5 9 24 9Z"
        fill="#111111"
        opacity="0.7"
      />
      <circle cx="22" cy="20" r="3.2" fill="#0B0B0B" />
      <circle cx="42" cy="20" r="3.2" fill="#0B0B0B" />
      <circle cx="22" cy="20" r="1.4" fill="#2A2A2A" />
      <circle cx="42" cy="20" r="1.4" fill="#2A2A2A" />
    </svg>
  );
}

export default function CarProgressLoader({ variant = "page" }: { variant?: "page" | "overlay" }) {
  return <CarProgressLoaderInner variant={variant} />;
}

export function CarProgressLoaderInner({ variant }: { variant: "page" | "overlay" }) {
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const carRef = useRef<HTMLDivElement | null>(null);
  const [barWidth, setBarWidth] = useState(0);
  const [carWidth, setCarWidth] = useState(0);

  // Measure sizes for accurate car positioning.
  useEffect(() => {
    const barEl = barRef.current;
    const carEl = carRef.current;
    if (!barEl || !carEl) return;

    const update = () => {
      setBarWidth(barEl.getBoundingClientRect().width);
      setCarWidth(carEl.getBoundingClientRect().width);
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(barEl);
    ro.observe(carEl);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Simulate a loading state over ~3.6s.
  useEffect(() => {
    const durationMs = 3600;
    const tickMs = 50;
    const step = 100 / (durationMs / tickMs);

    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + step);
        if (next >= 100) window.clearInterval(id);
        return next;
      });
    }, tickMs);

    return () => window.clearInterval(id);
  }, []);

  const carLeft = useMemo(() => {
    const travel = Math.max(0, barWidth - carWidth);
    return (progress / 100) * travel;
  }, [barWidth, carWidth, progress]);

  return (
    <div
      className={
        variant === "overlay"
          ? "fixed inset-0 z-9999 min-h-screen w-full bg-black/70 backdrop-blur-sm flex items-center justify-center"
          : "min-h-screen w-full flex items-center justify-center"
      }
    >
      <div className="w-[220px]">
        <div className="relative">
          <div
            ref={carRef}
            className="absolute -top-5 left-0 car-engine-bounce"
            style={{ transform: `translateX(${carLeft}px)` }}
          >
            <BlackCarIcon className="h-6 w-12" />
          </div>

          <div
            ref={barRef}
            className="relative h-2 w-full overflow-hidden rounded-full border border-slate-200/35 bg-slate-200/15"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Loading"
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, background: GRADIENT }}
            />
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] font-semibold tracking-[0.22em] text-[#FFC700]">
          Loading...
        </div>
      </div>
    </div>
  );
}
