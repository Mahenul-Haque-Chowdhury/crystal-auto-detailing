"use client";

import GlassSurface, { type GlassSurfaceProps } from "@/components/GlassSurface";
import AdaptiveBackgroundVideo from "@/components/AdaptiveBackgroundVideo";
import Image from "next/image";
import localFont from "next/font/local";
import {
  ButtonHTMLAttributes,
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

const migra = localFont({
  src: [
    {
      path: "../Migra - Free for Personal Use/Migra-Extralight.woff2",
      weight: "510",
      style: "normal",
    },
  ],
  display: "swap",
});

const LOGO_SRC = "/ghora1.png?v=2025-12-30";

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

export default function Home() {
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
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

  useEffect(() => {
    if (!hasHydratedDiscountsRef.current) return;
    setDiscountStore(generatedDiscounts);
  }, [generatedDiscounts]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;

    const lockScroll = () => {
      document.body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    };

    const unlockScroll = () => {
      document.body.style.overflow = "";
      html.style.overflow = "";
    };

    if (isDiscountOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }

    return () => {
      unlockScroll();
    };
  }, [isDiscountOpen]);

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

  const handleExplore = () => {
    if (!hasDiscountInteracted) {
      setHasDiscountInteracted(true);
    }
    setIsDiscountOpen(true);
  };

  const handleCloseDiscount = () => {
    setIsDiscountOpen(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <AdaptiveBackgroundVideo />
      <div className="backdrop-fade fixed inset-0" />

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-6 px-6 pt-20 pb-10 text-center md:px-12 md:pt-24 md:pb-12">
        <div className="pointer-events-none absolute inset-x-0 top-2 flex flex-col items-center text-center text-xs font-semibold uppercase tracking-[0.55em] text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.65)]">
          <Image
            src={LOGO_SRC}
            alt="Crystal Valley Auto Detail logo"
            width={400}
            height={400}
            className="h-[184px] w-[184px] object-contain"
            priority
          />
        </div>
        <div
          className={`${migra.className} -mt-14 space-y-3 text-3xl font-[510] leading-tight md:-mt-10 md:text-6xl`}
        >
          <p>Revive</p>
          <p>Refresh</p>
          <p>Reimagine Your Ride</p>
        </div>

        <div className="md:hidden mt-6 w-full text-center">
          <GlassButton
            type="button"
            className="px-3 py-1.5 text-xs font-semibold tracking-[0.02em] text-white normal-case"
            surfaceClassName="inline-flex mx-auto max-w-fit"
            surfaceProps={{ tint: "rgba(255, 255, 255, 0.16)", backgroundOpacity: 0.18, blur: 18 }}
            onClick={() => setIsStoryOpen(true)}
          >
            Founder’s Message
          </GlassButton>
        </div>
        <div className="hidden gap-4 md:flex">
          <GlassButton
            type="button"
            className="border border-white/30 px-8 py-3 text-sm tracking-[0.4em]"
            surfaceProps={{ tint: "rgba(255, 255, 255, 0.16)", backgroundOpacity: 0.18, blur: 18 }}
            onClick={handleExplore}
          >
            Explore Discount
          </GlassButton>
        </div>
      </div>

      {!isDiscountOpen && !isStoryOpen && (
        <div className="fixed inset-x-0 bottom-16 z-20 flex justify-center px-6 md:hidden">
          <GlassButton
            type="button"
            className="glow-ring w-full max-w-sm px-6 py-3 text-base tracking-[0.35em] text-white"
            surfaceClassName="w-full max-w-sm"
            surfaceProps={{ tint: "rgba(255, 255, 255, 0.16)", backgroundOpacity: 0.18, blur: 18 }}
            onClick={handleExplore}
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
        </div>
      )}

      <div className="fixed bottom-8 right-6 z-20 hidden md:flex">
        <GlassButton
          type="button"
          className="px-5 py-2.5 text-xs font-semibold tracking-[0.04em] normal-case"
          surfaceProps={{ tint: "rgba(255, 255, 255, 0.12)", backgroundOpacity: 0.16, blur: 18 }} 
          onClick={() => setIsStoryOpen(true)}
        >
          Founder’s Message
        </GlassButton>
      </div>

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
            <p className="text-5xl font-semibold leading-none">
              {revealedDiscount !== null ? `${revealedDiscount}%` : "--"}
            </p>
            <p className="text-sm text-white/70">Locked in for your vehicle. Book it instantly on WhatsApp.</p>
            <button
              type="button"
              onClick={openWhatsAppBooking}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-black/25" aria-hidden />
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

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-500 ${
          isStoryOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsStoryOpen(false)}
      />

      <aside
        className={`smooth-panel fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col gap-6 border-l border-white/10 bg-black/85 px-6 py-10 text-white shadow-2xl transform-gpu transition-transform duration-450 ease-[cubic-bezier(.25,.8,.25,1)] md:max-w-lg ${
          isStoryOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end">
          <button
            type="button"
            aria-label="Close founder message"
            className="close-orb"
            onClick={() => setIsStoryOpen(false)}
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
        <h3 className="text-3xl font-semibold leading-tight">Founder’s Message</h3>
        <div className="space-y-4 text-sm leading-relaxed text-white/75">
          <p>
            Crystal Valley Auto Detail began with passion and courage. I started this journey with one simple belief:
            when you put your heart into your work, people feel it.
          </p>
          <p>
            We may be a young business, but our commitment is strong. Every car is treated with care, honesty, and attention
            because trust matters.
          </p>
          <p>
            Thank you for supporting our journey. Your trust motivates us to build something meaningful and lasting.
          </p>
          <div className="space-y-1 text-white/80">
            <p>-</p>
            <p>Riffat Tonmoy</p>
            <p>Founder</p>
            <p>Crystal Valley Auto Detail</p>
          </div>
        </div>
      </aside>

      <div className="pointer-events-auto fixed bottom-3 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center text-center text-[10px] text-white/60 md:text-[11px]">
        <span>Developed by</span>
        <a
          href="https://grayvally.tech"
          target="_blank"
          rel="noreferrer noopener"
          className="font-semibold text-white underline-offset-2 hover:underline"
        >
          GrayVally Software Solutions
        </a>
      </div>
    </main>
  );
}
