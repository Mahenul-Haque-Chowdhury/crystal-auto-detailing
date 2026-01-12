"use client";

import GlassSurface, { type GlassSurfaceProps } from "@/components/GlassSurface";
import localFont from "next/font/local";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ButtonHTMLAttributes,
  ChangeEvent,
  FormEvent,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const migra = localFont({
  src: [
    {
      path: "../../Migra - Free for Personal Use/Migra-Extralight.woff2",
      weight: "510",
      style: "normal",
    },
  ],
  display: "swap",
});

type FormFields = {
  name: string;
  phone: string;
  carModel: string;
};

type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  borderRadius?: number;
  surfaceClassName?: string;
  surfaceProps?: Partial<GlassSurfaceProps>;
};

const DISCOUNT_STORAGE_KEY = "cvad:discounts:v1";
const LAST_SUBMISSION_KEY_STORAGE_KEY = "cvad:lastSubmissionKey:v1";

type DiscountStore = Record<string, number>;

const safeParseDiscountStore = (value: string | null): DiscountStore => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") return {};

    const result: DiscountStore = {};
    for (const [key, rawValue] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
        result[key] = rawValue;
      }
    }
    return result;
  } catch {
    return {};
  }
};

const getDiscountStore = (): DiscountStore => {
  if (typeof window === "undefined") return {};
  return safeParseDiscountStore(window.localStorage.getItem(DISCOUNT_STORAGE_KEY));
};

const setDiscountStore = (store: DiscountStore) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify(store));
};

const getLastSubmissionKey = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LAST_SUBMISSION_KEY_STORAGE_KEY);
};

const setLastSubmissionKey = (key: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_SUBMISSION_KEY_STORAGE_KEY, key);
};

const GlassButton = ({
  children,
  className = "",
  borderRadius = 999,
  surfaceClassName = "",
  surfaceProps,
  ...props
}: GlassButtonProps) => {
  const {
    className: surfaceExtraClass = "",
    style: surfaceExtraStyle,
    tint = "rgba(9, 12, 24, 0.82)",
    ...restSurfaceProps
  } = surfaceProps ?? {};

  return (
    <GlassSurface
      width="auto"
      height="auto"
      borderRadius={borderRadius}
      backgroundOpacity={0.22}
      brightness={70}
      opacity={0.9}
      saturation={1.35}
      blur={16}
      borderWidth={0.08}
      tint={tint}
      className={`inline-flex ${surfaceClassName} ${surfaceExtraClass}`.trim()}
      style={{ padding: 0, ...(surfaceExtraStyle ?? {}) }}
      {...restSurfaceProps}
    >
      <button
        {...props}
        className={`flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:text-white/80 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 ${className}`.trim()}
      >
        {children}
      </button>
    </GlassSurface>
  );
};

const HeroSection = memo(function HeroSection({
  migraClassName,
  isDiscountOpen,
  onExplore,
}: {
  migraClassName: string;
  isDiscountOpen: boolean;
  onExplore: () => void;
}) {
  return (
    <section className="relative h-dvh min-h-svh">
      <div className="relative z-10 flex h-dvh min-h-svh flex-col items-center justify-start gap-4 px-6 pt-[calc(env(safe-area-inset-top,20px)+72px)] pb-[calc(env(safe-area-inset-bottom,10px)+120px)] text-center md:gap-6 md:px-12 md:pt-28 md:pb-12">
        <motion.h1
          className={`${migraClassName} mt-6 space-y-2 text-2xl font-[510] leading-tight sm:mt-8 sm:space-y-3 sm:text-3xl md:mt-2 md:text-6xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Revive
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Refresh
          </motion.span>
          <motion.span
            className="block text-gold-400"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Reimagine Your Ride
          </motion.span>
        </motion.h1>

        {/* Desktop: Explore Discount button */}
        <motion.div
          className="hidden items-center gap-4 md:flex"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <GlassButton
            type="button"
            className="border border-white/30 px-8 py-3 text-sm tracking-[0.4em]"
            surfaceProps={{ tint: "rgba(255, 255, 255, 0.16)", backgroundOpacity: 0.18, blur: 18 }}
            onClick={onExplore}
          >
            Explore Discount
          </GlassButton>

          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={999}
            backgroundOpacity={0.14}
            saturation={1.25}
            tint="rgba(2, 6, 23, 0.55)"
            className="border border-white/12"
            style={{ padding: 0 }}
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-[0.22em] text-white/90 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
            >
              Back to Home
            </Link>
          </GlassSurface>
        </motion.div>

        {/* Mobile: Explore Discount button fixed at bottom */}
        <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,10px)+40px)] z-20 flex flex-col items-center gap-2.5 px-5 sm:bottom-14 sm:gap-3 sm:px-6 md:hidden">
          <AnimatePresence>
            {!isDiscountOpen && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4 }}
              >
                <GlassButton
                  type="button"
                  className="glow-ring w-full max-w-[320px] px-5 py-2.5 text-sm tracking-[0.25em] text-white sm:max-w-sm sm:px-6 sm:py-3 sm:text-base sm:tracking-[0.35em]"
                  surfaceClassName="w-full max-w-[320px] sm:max-w-sm"
                  surfaceProps={{ tint: "rgba(255, 255, 255, 0.16)", backgroundOpacity: 0.18, blur: 18 }}
                  onClick={onExplore}
                >
                  Explore Discount
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5v14m0 0 6-6m-6 6-6-6"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </GlassButton>
              </motion.div>
            )}
          </AnimatePresence>

          {!isDiscountOpen ? (
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={999}
              backgroundOpacity={0.12}
              saturation={1.15}
              tint="rgba(2, 6, 23, 0.5)"
              className="w-full max-w-[320px] border border-white/10 sm:max-w-sm"
              style={{ padding: 0 }}
            >
              <Link
                href="/"
                className="block w-full rounded-full px-5 py-2.5 text-center text-xs font-semibold tracking-[0.22em] text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
              >
                Back to Home
              </Link>
            </GlassSurface>
          ) : null}
        </div>
      </div>
    </section>
  );
});

export default function Home() {
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [hasDiscountInteracted, setHasDiscountInteracted] = useState(false);
  const [formData, setFormData] = useState<FormFields>({
    name: "",
    phone: "",
    carModel: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [revealedDiscount, setRevealedDiscount] = useState<number | null>(null);
  const [generatedDiscounts, setGeneratedDiscounts] = useState<Record<string, number>>(() =>
    typeof window === "undefined" ? {} : getDiscountStore()
  );
  const [activeSubmissionKey, setActiveSubmissionKey] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasHydratedDiscountsRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    hasHydratedDiscountsRef.current = true;
  }, []);

  // Keep Discounts page as a single, non-scrollable viewport.
  useEffect(() => {
    if (typeof document === "undefined") return;

    const html = document.documentElement;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;

    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedDiscountsRef.current) return;
    setDiscountStore(generatedDiscounts);
  }, [generatedDiscounts]);

  const isFormValid = Object.values(formData).every((field) => field.trim().length);

  const handleInputChange = (field: keyof FormFields) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      if (formError) setFormError(null);
    };

  const buildSubmissionKey = () => {
    const normalizedName = formData.name.trim().toLowerCase();
    const normalizedPhone = formData.phone.replace(/\D/g, "");
    return {
      normalizedName,
      normalizedPhone,
      submissionKey: `${normalizedName}|${normalizedPhone}`,
    };
  };

  const openWhatsAppBooking = () => {
    const messageDiscountKey = activeSubmissionKey ?? getLastSubmissionKey();
    const store = getDiscountStore();
    const discount = (messageDiscountKey ? store[messageDiscountKey] : undefined) ?? revealedDiscount ?? undefined;

    if (!discount) return;

    const message =
      `Hello Crystal Valley Auto Detail,\n` +
      `I’ve received a ${discount}% discount coupon via your website and would like to book a service.`;

    // Use wa.me/<phone>?text= because wa.me/message/<code> does not reliably support prefilled text.
    const url = `https://wa.me/8801841353850?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleGenerate = async () => {
    if (!isFormValid || isGenerating) return;

    const { submissionKey } = buildSubmissionKey();
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const carModel = formData.carModel.trim();

    setIsGenerating(true);
    setIsGeneratingModalOpen(true);
    setIsResultModalOpen(false);
    setRevealedDiscount(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch("/api/discounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, carModel }),
          });

          if (response.status === 409) {
            setFormError("A discount already exists for this name or phone number.");
            setIsGenerating(false);
            setIsGeneratingModalOpen(false);
            setIsResultModalOpen(false);
            return;
          }

          if (!response.ok) {
            let payload: unknown = null;
            try {
              payload = await response.json();
            } catch {
              payload = null;
            }

            const messageFromServer =
              payload &&
              typeof payload === "object" &&
              "message" in payload &&
              typeof (payload as { message?: unknown }).message === "string"
                ? (payload as { message: string }).message
                : null;

            const statusFromServer =
              payload &&
              typeof payload === "object" &&
              "status" in payload &&
              typeof (payload as { status?: unknown }).status === "string"
                ? (payload as { status: string }).status
                : null;

            console.error("Discount API error", {
              httpStatus: response.status,
              status: statusFromServer,
              message: messageFromServer,
              payload,
            });

            setFormError(
              statusFromServer === "misconfigured" && messageFromServer
                ? messageFromServer
                : "Unable to generate a discount right now. Please try again."
            );
            setIsGenerating(false);
            setIsGeneratingModalOpen(false);
            setIsResultModalOpen(false);
            return;
          }

          const payload = (await response.json()) as { status?: string; discount?: number };
          const discount = typeof payload.discount === "number" ? payload.discount : null;
          if (discount === null) {
            setFormError("Unable to generate a discount right now. Please try again.");
            setIsGenerating(false);
            setIsGeneratingModalOpen(false);
            setIsResultModalOpen(false);
            return;
          }

          setActiveSubmissionKey(submissionKey);
          setLastSubmissionKey(submissionKey);
          setGeneratedDiscounts((prev) => ({ ...prev, [submissionKey]: discount }));
          setRevealedDiscount(discount);
          setFormError(null);
          setIsGenerating(false);
          setIsGeneratingModalOpen(false);
          setIsResultModalOpen(true);
        } catch {
          setFormError("Unable to generate a discount right now. Please try again.");
          setIsGenerating(false);
          setIsGeneratingModalOpen(false);
          setIsResultModalOpen(false);
        }
      })();
    }, 1600);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleGenerate();
  };

  const handleExplore = useCallback(() => {
    setHasDiscountInteracted(true);
    setIsDiscountOpen(true);
  }, []);

  const handleCloseDiscount = useCallback(() => {
    setIsDiscountOpen(false);
  }, []);

  return (
    <motion.main 
      className="relative h-dvh overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection migraClassName={migra.className} isDiscountOpen={isDiscountOpen} onExplore={handleExplore} />

      <div
        className={`fixed inset-0 z-30 flex items-start justify-center overflow-y-auto px-3 py-4 transition sm:px-4 md:items-center md:px-6 md:py-0 ${
          isDiscountOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isDiscountOpen}
      >
        <div
          className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ${
            isDiscountOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleCloseDiscount}
        />
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={36}
          backgroundOpacity={0.32}
          brightness={60}
          opacity={0.92}
          saturation={1.2}
          blur={28}
          borderWidth={0.08}
          tint="rgba(0, 0, 0, 0.95)"
          className={`glass-dialog-shell smooth-panel relative w-full max-w-lg overflow-y-auto overscroll-contain transform-gpu md:max-w-3xl md:overflow-visible ${
            isDiscountOpen
              ? "modal-enter"
              : hasDiscountInteracted
              ? "modal-exit"
              : "translate-y-full opacity-0 md:scale-95"
          }`}
          role="dialog"
          aria-modal="true"
          style={{
            padding: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
          }}
        >
          <div className="flex max-h-[calc(100vh-2rem)] flex-col gap-6 overflow-y-auto rounded-[34px] border border-white/15 bg-black px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm sm:px-6 md:max-h-full md:px-10 md:py-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold">Claim your Bonus</h2>
                <p className="mt-2 text-sm text-white/70">
                  Submit your details to reveal a special offer.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close discount generator"
                className="close-orb"
                onClick={handleCloseDiscount}
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  className="close-orb__icon"
                >
                  <path d="M4.5 4.5l9 9" />
                  <path d="M13.5 4.5l-9 9" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white md:text-sm">
                UP TO 70% OFF!
              </span>
            </div>

            <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white outline-none transition focus:border-white/60 md:py-2.5 md:text-base"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white outline-none transition focus:border-white/60 md:py-2.5 md:text-base"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Car model
                </label>
                <input
                  type="text"
                  placeholder="Enter your car model"
                  value={formData.carModel}
                  onChange={handleInputChange("carModel")}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white outline-none transition focus:border-white/60 md:py-2.5 md:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isGenerating}
                className="mt-2 mx-auto flex w-fit items-center justify-center gap-2 rounded-full border border-white/25 bg-black/80 px-6 py-3 text-base font-semibold tracking-[0.26em] text-white transition hover:border-white/40 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-40 md:mt-4"
              >
                <span>{isGenerating ? "Generating" : "Generate Discount"}</span>
                {isGenerating && <div className="h-2 w-2 rounded-full bg-white" />}
              </button>

              {formError && (
                <p className="text-sm font-medium text-red-400" role="alert">
                  {formError}
                </p>
              )}

              <p className="text-[11px] text-white/50 md:text-xs">
                This discount is system-generated. Any misuse or forgery will void it.
              </p>
            </form>
          </div>
        </GlassSurface>
      </div>

      <div
        className={`fixed inset-0 z-40 flex items-center justify-center px-6 transition duration-300 ${
          isGeneratingModalOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isGeneratingModalOpen}
      >
        <div className="absolute inset-0 bg-black/60" />
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={24}
          backgroundOpacity={0.35}
          brightness={70}
          opacity={0.95}
          saturation={1.2}
          blur={20}
          borderWidth={0.08}
          tint="rgba(6, 9, 18, 0.92)"
          className="smooth-panel relative w-full max-w-sm"
          style={{ padding: 0 }}
        >
          <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-white/15 bg-black/85 px-6 py-7 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="h-2.5 w-2.5 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "0.12s" }} />
              <span className="h-2.5 w-2.5 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "0.24s" }} />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold">Generating your discount</p>
              <p className="text-sm text-white/70">Hang tight while we tailor an offer for your vehicle.</p>
            </div>
          </div>
        </GlassSurface>
      </div>

      <div
        className={`fixed inset-0 z-40 flex items-center justify-center px-6 transition duration-300 ${
          isResultModalOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isResultModalOpen}
      >
        <div className="absolute inset-0 bg-black/60" />
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={24}
          backgroundOpacity={0.35}
          brightness={70}
          opacity={0.95}
          saturation={1.2}
          blur={20}
          borderWidth={0.08}
          tint="rgba(6, 9, 18, 0.92)"
          className="smooth-panel relative w-full max-w-sm"
          style={{ padding: 0 }}
        >
          <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-white/15 bg-black/85 px-6 py-7 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <p className="text-lg font-semibold">
              {formData.name ? `Congratulations, ${formData.name}!` : "Congratulations!"}
            </p>
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">Your discount</p>
            <p className="text-4xl font-semibold leading-none sm:text-5xl">
              {revealedDiscount !== null ? `${revealedDiscount}%` : "--"}
            </p>
            <p className="text-sm text-white/70">Locked in for your vehicle. Book it instantly on WhatsApp.</p>
            <button
              type="button"
              onClick={openWhatsAppBooking}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                <path d="M12.04 2.01c-5.52 0-10 4.48-10 10 0 1.77.46 3.5 1.34 5.02L2 22l5.12-1.34c1.47.8 3.12 1.22 4.79 1.22h.01c5.52 0 10-4.48 10-10 0-2.65-1.03-5.14-2.9-7.01a9.94 9.94 0 0 0-7.02-2.86Zm5.78 14.49c-.24.68-1.39 1.31-1.92 1.39-.49.08-1.11.11-1.8-.11-.42-.14-.96-.31-1.65-.6-2.9-1.25-4.79-4.19-4.93-4.39-.14-.2-1.18-1.57-1.18-3 0-1.43.75-2.13 1.01-2.42.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.66.5.24.58.82 2.01.89 2.16.07.14.12.31.02.5-.1.2-.15.31-.29.48-.14.17-.31.38-.45.51-.14.14-.28.29-.12.57.16.29.72 1.18 1.55 1.91 1.07.95 1.98 1.25 2.26 1.39.29.14.46.12.63-.07.17-.2.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.63.77 1.91.91.28.14.46.22.53.34.07.12.07.7-.17 1.38Z" />
              </svg>
              Book on WhatsApp
            </button>
            <GlassButton
              type="button"
              className="mt-2 px-5 py-2.5 text-xs font-semibold tracking-[0.04em] text-white normal-case"
              surfaceProps={{ tint: "rgba(6, 9, 18, 0.85)" }}
              onClick={() => setIsResultModalOpen(false)}
            >
              Close
            </GlassButton>
          </div>
        </GlassSurface>
      </div>
    </motion.main>
  );
}
