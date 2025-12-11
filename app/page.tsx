"use client";

import GlassSurface, { type GlassSurfaceProps } from "@/components/GlassSurface";
import Image from "next/image";
import {
  ButtonHTMLAttributes,
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

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

const MIN_DISCOUNT = 21;
const MAX_DISCOUNT = 31;

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
  const [generatedDiscounts, setGeneratedDiscounts] = useState<Record<string, number>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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

  const handleGenerate = () => {
    if (!isFormValid || isGenerating) return;

    const normalizedName = formData.name.trim().toLowerCase();
    const normalizedPhone = formData.phone.replace(/\D/g, "");
    const submissionKey = `${normalizedName}|${normalizedPhone}`;

    const hasDuplicate = Object.keys(generatedDiscounts).some((key) => {
      const [existingName, existingPhone] = key.split("|");
      return existingName === normalizedName || existingPhone === normalizedPhone;
    });

    if (hasDuplicate) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsGenerating(false);
      setIsGeneratingModalOpen(false);
      setIsResultModalOpen(false);
      setFormError("A discount already exists for this name or phone number.");
      return;
    }

    setIsGenerating(true);
    setIsGeneratingModalOpen(true);
    setIsResultModalOpen(false);
    setRevealedDiscount(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const discount =
        Math.floor(Math.random() * (MAX_DISCOUNT - MIN_DISCOUNT + 1)) + MIN_DISCOUNT;
      setGeneratedDiscounts((prev) => ({ ...prev, [submissionKey]: discount }));
      setRevealedDiscount(discount);
      setFormError(null);
      setIsGenerating(false);
      setIsGeneratingModalOpen(false);
      setIsResultModalOpen(true);
    }, 1600);
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

      <div className="relative z-10 flex h-screen flex-col items-center justify-center gap-6 px-6 pt-20 pb-10 text-center md:px-12 md:pt-24 md:pb-12">
        <div className="pointer-events-none absolute inset-x-0 -top-12 flex flex-col items-center text-center text-xs font-semibold uppercase tracking-[0.55em] text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.65)]">
          <Image
            src="/ghora1.png"
            alt="Crystal Auto Detailing logo"
            width={400}
            height={400}
            className="h-[17rem] w-[17rem] object-contain"
            priority
          />
        </div>
        <div className="-mt-14 space-y-3 text-3xl font-semibold leading-tight md:-mt-10 md:text-6xl">
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
                This discount is generated randomly by  our system.
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
            <p className="text-sm text-white/70">Locked in for your vehicle. Show this at check-in.</p>
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
        <div className="flex items-center justify-between">
          <GlassButton
            type="button"
            className="px-4 py-2 text-[0.55rem] tracking-[0.45em]"
            surfaceProps={{ tint: "rgba(255, 255, 255, 0.12)" }}
            onClick={() => setIsStoryOpen(false)}
          >
            Close
          </GlassButton>
        </div>
        <h3 className="text-3xl font-semibold leading-tight">Founder’s Message</h3>
        <div className="space-y-4 text-sm leading-relaxed text-white/75">
          <p>
            Crystal Auto Detailing began with a dream and a lot of courage. 
            This is a small startup built from a deep passion for cars and a desire to create something of real value. 
            I started this journey with one belief. If you put your heart into your work, people will feel it.
          </p>
          <p>
            Every car we handle is more than a job for us. It is a chance to prove ourselves. 
            It is a chance to show that a new business can still deliver honest work, careful hands, and real dedication. 
            As a young startup we may be growing, but our commitment is already strong. We take every customer, every car, 
            and every detail seriously.
          </p>
          <p>
            Thank you for supporting a new beginning. Your trust means everything to us.
            It gives us strength, hope, and the motivation to build something lasting and meaningful.
          </p>
          <div className="space-y-1 text-white/80">
            <p>-</p>
            <p>Riffat Tonmoy</p>
            <p>Founder</p>
            <p>Crystal Auto Detailing</p>
          </div>
        </div>
      </aside>

      <div className="pointer-events-auto fixed bottom-3 left-1/2 z-30 text-[10px] text-white/60 md:text-[11px] -translate-x-1/2">
        Developed by
        <a
          href="https://grayvally.tech"
          target="_blank"
          rel="noreferrer noopener"
          className="ml-1 font-semibold text-white underline-offset-2 hover:underline"
        >
          GrayVally IT
        </a>
      </div>
    </main>
  );
}
