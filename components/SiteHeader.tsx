"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import GlassSurface from "./GlassSurface";

const LOGO_SRC = "/ghora1.png?v=2026-01-12-update";
const CALL_NOW_TEL = "tel:+8801XXXXXXXXX";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/discounts", label: "Discounts" },
] as const;

const isActiveHref = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const html = document.documentElement;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
    };
  }, [isMenuOpen]);

  return (
    <motion.header 
      className="safe-area-top sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={0}
          backgroundOpacity={0.12}
          saturation={1.35}
          tint="rgba(2, 6, 23, 0.55)"
          className="border-b border-gold-400/15"
        >
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 py-1 font-semibold tracking-tight text-white hover:text-white"
              aria-label="Crystal Valley Auto Detail"
            >
              <span className="relative h-12 w-20 shrink-0 md:w-24">
                <Image
                  src={LOGO_SRC}
                  alt="Crystal Valley Auto Detail"
                  width={96}
                  height={96}
                  className="h-12 w-12 origin-left scale-[1.8] object-contain md:scale-[2.0]"
                  priority
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="flex items-center gap-2 text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
                  <span className="text-white">Crystal</span>
                  <span className="px-0 py-0 text-radiant-gold">
                    Valley
                  </span>
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.42em] text-white/70 sm:text-[11px] md:text-xs">
                  Auto Detail
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
              {navItems.map((item, index) => (
                (() => {
                  const active = isActiveHref(pathname, item.href);
                  return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                >
                  <GlassSurface
                    width="auto"
                    height="auto"
                    borderRadius={999}
                    backgroundOpacity={0.14}
                    saturation={1.25}
                    tint={active ? "rgba(2, 6, 23, 0.72)" : "rgba(2, 6, 23, 0.55)"}
                    className={
                      active
                        ? "border border-gold-300/35 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                        : "border border-white/10"
                    }
                  >
                    <Link
                      href={item.href}
                      className={
                        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 " +
                        (active
                          ? "text-gold-100"
                          : "text-slate-100/90 hover:text-gold-100")
                      }
                    >
                      {item.label}
                    </Link>
                  </GlassSurface>
                </motion.div>
                  );
                })()
              ))}
              <motion.a
                href={CALL_NOW_TEL}
                className="rounded-full bg-polish-gold px-4 py-2 text-sm font-extrabold tracking-tight text-black shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition hover:brightness-110"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Call now
              </motion.a>
            </nav>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-radiant-gold hover:bg-slate-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 md:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-primary-nav"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className="flex flex-col items-end gap-1.5" aria-hidden="true">
                <span
                  className={`block h-0.5 rounded bg-current transition-transform duration-300 ease-out ${
                    isMenuOpen ? "w-6 translate-y-2 rotate-45" : "w-6"
                  }`}
                />
                <span
                  className={`block h-0.5 rounded bg-current transition-all duration-300 ease-out ${
                    isMenuOpen ? "w-6 opacity-0" : "w-5 opacity-90"
                  }`}
                />
                <span
                  className={`block h-0.5 rounded bg-current transition-transform duration-300 ease-out ${
                    isMenuOpen ? "w-6 -translate-y-2 -rotate-45" : "w-4 opacity-80"
                  }`}
                />
              </span>
            </button>
          </div>
        </GlassSurface>

        {/* Mobile menu overlay + dropdown (outside GlassSurface to avoid overflow clipping) */}
        <div className="md:hidden">
          <AnimatePresence>
            {isMenuOpen && (
              <motion.button
                type="button"
                aria-hidden={!isMenuOpen}
                tabIndex={isMenuOpen ? 0 : -1}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                id="mobile-primary-nav"
                className="absolute left-0 right-0 top-full z-50 border-b border-gold-400/15 bg-slate-950/70 backdrop-blur-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-1 px-4 py-3">
                  {navItems.map((item, index) => (
                    (() => {
                      const active = isActiveHref(pathname, item.href);
                      return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <GlassSurface
                        width="100%"
                        height="auto"
                        borderRadius={14}
                        backgroundOpacity={0.14}
                        saturation={1.25}
                        tint={active ? "rgba(2, 6, 23, 0.78)" : "rgba(2, 6, 23, 0.6)"}
                        className={active ? "border border-gold-300/30" : "border border-white/10"}
                      >
                        <Link
                          href={item.href}
                          className={
                            "block rounded-[14px] px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 " +
                            (active
                              ? "text-gold-100"
                              : "text-slate-100/90 hover:text-gold-100")
                          }
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </GlassSurface>
                    </motion.div>
                      );
                    })()
                  ))}
                  <motion.a
                    href={CALL_NOW_TEL}
                    className="mt-2 rounded-[14px] bg-polish-gold px-4 py-3 text-center text-sm font-extrabold tracking-tight text-black shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition hover:brightness-110"
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    Call now
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
