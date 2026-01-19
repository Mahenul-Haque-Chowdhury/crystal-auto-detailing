"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import GlassSurface from "./GlassSurface";

const LOGO_SRC = "/ghora1.png?v=2026-01-12-update";
const CALL_NOW_TEL = "tel:+8801841353850";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/discounts", label: "Discounts" },
] as const;

const isActiveHref = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function SiteHeader() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const justOpenedRef = useRef(false);
  const [isOverlayArmed, setIsOverlayArmed] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion) return;

    // When the mobile menu is open, we stop scroll tracking.
    if (isMenuOpen) return;

    const delta = 6;
    const hideAfterY = 80;

    lastScrollYRef.current = window.scrollY || 0;

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const currentY = window.scrollY || 0;
        const lastY = lastScrollYRef.current;

        if (currentY <= 8) {
          setIsHidden(false);
          lastScrollYRef.current = currentY;
          return;
        }

        const scrollingDown = currentY > lastY + delta;
        const scrollingUp = currentY < lastY - delta;

        if (scrollingDown && currentY > hideAfterY) setIsHidden(true);
        if (scrollingUp) setIsHidden(false);

        lastScrollYRef.current = currentY;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isMenuOpen, prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = headerRef.current;
    if (!el) return;

    const setVar = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--site-header-h", `${h}px`);
    };

    setVar();

    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

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
    if (!isMenuOpen) {
      setIsOverlayArmed(false);
      return;
    }

    const armId = window.setTimeout(() => setIsOverlayArmed(true), 250);
    return () => window.clearTimeout(armId);
  }, [isMenuOpen]);

  const openMenu = () => {
    setIsHidden(false);
    setIsMenuOpen(true);
    justOpenedRef.current = true;
    window.setTimeout(() => {
      justOpenedRef.current = false;
    }, 250);
  };

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
      return;
    }

    openMenu();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMenuOpen) return;

    const focusId = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusId);
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
      ref={headerRef}
      className="safe-area-top fixed left-0 right-0 top-0 z-50"
      initial={{ y: -120, opacity: 0 }}
      animate={
        prefersReducedMotion
          ? { y: 0, opacity: 1 }
          : { y: isMenuOpen ? 0 : isHidden ? "-110%" : 0, opacity: 1 }
      }
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform" }}
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
                  sizes="(max-width: 768px) 80px, 96px"
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
              ref={closeButtonRef}
              type="button"
              className={`inline-flex items-center justify-center rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 md:hidden ${
                isMenuOpen ? "opacity-0 pointer-events-none" : "text-radiant-gold hover:bg-slate-950/40"
              }`}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-primary-nav"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                openMenu();
              }}
            >
              <span className="flex flex-col items-end gap-1.5" aria-hidden="true">
                <span
                  className="block h-0.5 w-6 rounded bg-current transition-transform duration-300 ease-out"
                />
                <span
                  className="block h-0.5 w-5 rounded bg-current opacity-90 transition-all duration-300 ease-out"
                />
                <span
                  className="block h-0.5 w-4 rounded bg-current opacity-80 transition-transform duration-300 ease-out"
                />
              </span>
            </button>
          </div>
        </GlassSurface>

        {/* Mobile menu overlay (Portal to body to escape header transform) */}
        {mounted && createPortal(
          <div className="md:hidden relative z-[9999]">
            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={closeMenu}
                  />
                  <motion.div
                    key="menu-panel"
                    className="fixed inset-y-0 right-0 z-10 flex w-full max-w-[300px] flex-col border-l border-gold-400/20 bg-slate-950 shadow-2xl"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 p-4">
                      <span className="text-lg font-bold text-white">Menu</span>
                      <button
                        onClick={closeMenu}
                        className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
                        aria-label="Close menu"
                      >
                        <span className="text-2xl leading-none" aria-hidden="true">×</span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-2 overflow-y-auto p-4">
                      {navItems.map((item) => {
                        const active = isActiveHref(pathname, item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className={`block rounded-lg px-4 py-3 text-lg font-medium transition-colors ${
                              active
                                ? "bg-white/10 text-gold-100"
                                : "text-slate-100 hover:bg-white/5 hover:text-gold-100"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                      <a
                        href={CALL_NOW_TEL}
                        className="mt-4 block rounded-lg bg-polish-gold px-4 py-3 text-center text-lg font-bold text-black shadow-lg hover:brightness-110"
                        onClick={closeMenu}
                      >
                        Call Now
                      </a>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>,
          document.body
        )}
      </div>
    </motion.header>
  );
}
