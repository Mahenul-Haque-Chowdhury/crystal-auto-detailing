"use client";

import GlassSurface, { type GlassSurfaceProps } from "@/components/GlassSurface";
import {
  ButtonHTMLAttributes,
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

const MIN_DISCOUNT = 5;
const MAX_DISCOUNT = 30;

type FormFields = {
  name: string;
  phone: string;
  carModel: string;
};

const getRandomDiscount = () =>
  Math.floor(Math.random() * (MAX_DISCOUNT - MIN_DISCOUNT + 1)) + MIN_DISCOUNT;

type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  borderRadius?: number;
  surfaceClassName?: string;
  surfaceProps?: Partial<GlassSurfaceProps>;
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
  const [displayedDiscount, setDisplayedDiscount] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const previousOverflow = document.body.style.overflow;
    const shouldLockScroll = isDiscountOpen || isStoryOpen;

    if (shouldLockScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDiscountOpen, isStoryOpen]);

  const isFormValid = Object.values(formData).every((field) => field.trim().length);

  const handleInputChange = (field: keyof FormFields) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleGenerate = () => {
    if (!isFormValid || isGenerating) return;

    setIsGenerating(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    intervalRef.current = setInterval(() => {
      setDisplayedDiscount(getRandomDiscount());
    }, 80);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      const finalDiscount = getRandomDiscount();
      setDisplayedDiscount(finalDiscount);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleGenerate();
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
      <video
        className="media-guard fixed inset-0 h-full w-full object-cover"
        src="/background.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        draggable={false}
        tabIndex={-1}
        onContextMenu={(event) => event.preventDefault()}
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="backdrop-fade fixed inset-0" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6 pb-12 pt-24 text-center md:px-12">
        <div className="pointer-events-none absolute inset-x-0 top-8 flex flex-col items-center text-center text-xs font-semibold uppercase tracking-[0.55em] text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.65)]">
          <span className="block text-base md:text-lg">Crystal Auto</span>
          <span className="mt-1 block text-base md:text-lg">Detailing</span>
        </div>
        <div className="space-y-3 text-3xl font-semibold leading-tight md:text-6xl">
          <p>Revive</p>
          <p>Refresh</p>
          <p>Reimagine Your Ride</p>
        </div>
        <p className="max-w-2xl text-sm text-white/80 md:text-base">
          Cinematic detailing suites, concierge pickup, and ceramic layering that keep your vehicle
          camera-ready.
        </p>
        <div className="md:hidden mt-6 w-full text-center">
          <GlassButton
            type="button"
            className="px-3 py-1.5 text-xs font-semibold tracking-[0.02em] text-white normal-case"
            surfaceClassName="inline-flex mx-auto max-w-fit"
            surfaceProps={{ tint: "rgba(255, 255, 255, 0.09)" }}
            onClick={() => setIsStoryOpen(true)}
          >
            Our story
          </GlassButton>
        </div>
        <div className="hidden gap-4 md:flex">
          <GlassButton
            type="button"
            className="border border-white/30 px-8 py-3 text-sm tracking-[0.4em]"
            surfaceProps={{ tint: "rgba(8, 8, 8, 0.54)" }}
            onClick={handleExplore}
          >
            Explore Discount
          </GlassButton>
        </div>
      </div>

      {!isDiscountOpen && !isStoryOpen && (
        <div className="fixed inset-x-0 bottom-8 z-20 flex justify-center px-6 md:hidden">
          <GlassButton
            type="button"
            className="glow-ring w-full max-w-sm px-6 py-3 text-base tracking-[0.35em] text-white"
            surfaceClassName="w-full max-w-sm"
            surfaceProps={{ tint: "rgba(31, 29, 29, 0.45)" }}
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
          surfaceProps={{ tint: "rgba(6, 9, 18, 0.85)" }}
          onClick={() => setIsStoryOpen(true)}
        >
          Our story
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
                <h2 className="text-3xl font-semibold">Claim your launch bonus</h2>
                <p className="mt-2 text-sm text-white/70">
                  Submit your details to reveal a personalized Crystal Auto Detailing offer.
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
              <span className="text-xs uppercase tracking-[0.4em] text-white/60">
                limited launch allocations
              </span>
            </div>

            <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Skyler Rey"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-white/60 md:py-3 md:text-base"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="(+880)1798656969"
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-white/60 md:py-3 md:text-base"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Car model
                </label>
                <input
                  type="text"
                  placeholder="2024 Porsche Taycan"
                  value={formData.carModel}
                  onChange={handleInputChange("carModel")}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-white/60 md:py-3 md:text-base"
                />
              </div>

              <GlassButton
                type="submit"
                disabled={!isFormValid || isGenerating}
                className="mt-2 w-full px-6 py-3.5 text-sm tracking-[0.25em] text-white md:mt-4 md:text-base"
                surfaceProps={{ tint: "rgba(12, 15, 24, 0.9)" }}
              >
                <span>{isGenerating ? "Generating" : "Generate Discount"}</span>
                {isGenerating && <div className="h-2 w-2 rounded-full bg-white" />}
              </GlassButton>
            </form>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 md:p-6">
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">Your discount</p>
              <div className="mt-4 flex items-end gap-3">
                <p className={`text-5xl font-semibold leading-none ${isGenerating ? "animate-pulse" : ""}`}>
                  {displayedDiscount ? `${displayedDiscount}%` : "--"}
                </p>
                <span className="text-xs text-white/60">
                  {isGenerating
                    ? "Calibrating offer"
                    : displayedDiscount
                    ? "Locked in"
                    : "Awaiting details"}
                </span>
              </div>
              <p className="mt-4 text-xs text-white/60">
                Tap generate to lock in a launch incentive tailored to your vehicle.
              </p>
            </div>
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
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.5em] text-white/60">Studio Story</p>
          <GlassButton
            type="button"
            className="px-4 py-2 text-[0.55rem] tracking-[0.45em]"
            surfaceProps={{ tint: "rgba(255, 255, 255, 0.12)" }}
            onClick={() => setIsStoryOpen(false)}
          >
            Close
          </GlassButton>
        </div>
        <h3 className="text-3xl font-semibold leading-tight">Our story</h3>
        <div className="space-y-4 text-sm leading-relaxed text-white/75">
          <p>
            Crystal Auto Detailing was founded with one goal in mind: to bring out the true beauty
            of every vehicle that comes through our doors. What began as a personal love for clean,
            well-kept cars has grown into a full-service detailing shop trusted by drivers who want
            quality without compromise.
          </p>
          <p>
            From the start, we focused on doing things the right way—using premium products, modern
            techniques, and giving every vehicle the time and attention it deserves. Over the years,
            our dedication to craftsmanship and customer satisfaction has shaped who we are today.
          </p>
          <p>
            At Crystal Auto Detailing, we believe detailing is more than a service—it is an
            experience. We work hard to make sure every customer leaves with a car that feels
            refreshed, protected, and ready to turn heads. Your vehicle is an investment, and we are
            here to help it shine for years to come.
          </p>
        </div>
      </aside>
    </main>
  );
}
