'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import GlassSurface from '@/components/GlassSurface';
import { PageWrapper, SectionTransition } from '@/components/animations/PageTransition';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { SlideIn } from '@/components/animations/SlideIn';
import { FadeIn } from '@/components/animations/FadeIn';
import {
  CalendarClock,
  Car,
  Check,
  ChevronDown,
  Clipboard,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
  MapPin,
  Leaf,
  Clock,
  Briefcase,
  Droplets,
} from 'lucide-react';

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12.04 2.01c-5.52 0-10 4.48-10 10 0 1.77.46 3.5 1.34 5.02L2 22l5.12-1.34c1.47.8 3.12 1.22 4.79 1.22h.01c5.52 0 10-4.48 10-10 0-2.65-1.03-5.14-2.9-7.01a9.94 9.94 0 0 0-7.02-2.86Zm5.78 14.49c-.24.68-1.39 1.31-1.92 1.39-.49.08-1.11.11-1.8-.11-.42-.14-.96-.31-1.65-.6-2.9-1.25-4.79-4.19-4.93-4.39-.14-.2-1.18-1.57-1.18-3 0-1.43.75-2.13 1.01-2.42.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.66.5.24.58.82 2.01.89 2.16.07.14.12.31.02.5-.1.2-.15.31-.29.48-.14.17-.31.38-.45.51-.14.14-.28.29-.12.57.16.29.72 1.18 1.55 1.91 1.07.95 1.98 1.25 2.26 1.39.29.14.46.12.63-.07.17-.2.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.63.77 1.91.91.28.14.46.22.53.34.07.12.07.7-.17 1.38Z" />
    </svg>
  );
}

type ServiceOption =
  | 'Basic Wash'
  | 'Super Wash & Interior'
  | 'Single-Stage Polish'
  | 'Glass Polish'
  | 'Basic Ceramic (6-9 Months)'
  | 'Ceramic Care+ (18-24 Months)';
type CarTypeOption = 'Sedan' | 'SUV' | 'Microbus';

type FormState = {
  service: ServiceOption;
  carType: CarTypeOption;
  fullName: string;
  phone: string;
  address: string;
  dateTimeLocal: string;
  remarks: string;
};

const WHATSAPP_NUMBER = '8801841353850';
const PHONE_NUMBER_DISPLAY = '+8801841353850';
const PHONE_NUMBER_TEL = '+8801841353850';

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function formatBDT(amount: number) {
  return `${amount.toLocaleString('en-US')} BDT`;
}

type EstimatedPrice = { kind: 'exact'; amount: number } | { kind: 'from'; amount: number };

function getEstimatedPrice(service: ServiceOption, carType: CarTypeOption): EstimatedPrice | null {
  switch (service) {
    case 'Basic Wash':
      return {
        kind: 'exact',
        amount: carType === 'Sedan' ? 700 : 900,
      };
    case 'Super Wash & Interior':
      return {
        kind: 'exact',
        amount: carType === 'Sedan' ? 1200 : 1500,
      };
    case 'Single-Stage Polish':
      return {
        kind: 'exact',
        amount: carType === 'Sedan' ? 4500 : carType === 'SUV' ? 5500 : 6500,
      };
    case 'Basic Ceramic (6-9 Months)':
      return {
        kind: 'exact',
        amount: carType === 'Sedan' ? 8000 : 10000,
      };
    case 'Ceramic Care+ (18-24 Months)':
      return {
        kind: 'exact',
        amount: carType === 'Sedan' ? 10000 : carType === 'SUV' ? 12500 : 13000,
      };
    case 'Glass Polish':
      return { kind: 'from', amount: 600 };
    default:
      return null;
  }
}

export default function ServicesPage() {
  // Bump this string if you replace images in /public but the browser keeps showing the old cached version.
  const serviceImageVersion = '2026-01-13-1';
  const packageImageVersion = '2026-01-13-2';

  type PackageTabKey = 'sedan' | 'suv' | 'noah';

  const packageTabs = useMemo(
    () =>
      [
        {
          key: 'sedan' as const,
          label: 'Sedan',
          imageSrc: `/sadan.png?v=${packageImageVersion}`,
          heading: 'Sedan Car Service Details',
          items: [
            'Car Models: Toyota Allion, Premio, Axio, Corolla, Honda Grace, City, Nissan Sunny, Mitsubishi Lancer, and more',
            { label: 'Basic Wash:', price: '৳ 700 BDT' },
            { label: 'Super Wash & Interior:', price: '৳ 1,200 BDT' },
            { label: 'Single stage polish:', price: '৳ 4,500 BDT' },
            { label: 'Basic Ceramic:', price: '৳ 8,000 BDT' },
            { label: 'Ceramic Care+:', price: '৳ 10,000 BDT' },
          ],
        },
        {
          key: 'suv' as const,
          label: 'SUV / MUV',
          imageSrc: `/suv.png?v=${packageImageVersion}`,
          heading: 'SUV/MUV Car Service Details',
          items: [
            'Car Models: Toyota Harrier, RAV4, Prado, Nissan X-Trail, Honda CR-V, and more',
            { label: 'Basic Wash:', price: '৳ 900 BDT' },
            { label: 'Super Wash & Interior:', price: '৳ 1,500 BDT' },
            { label: 'Single stage polish:', price: '৳ 5,500 BDT' },
            { label: 'Basic Ceramic:', price: '৳ 10,000 BDT' },
            { label: 'Ceramic Care+:', price: '৳ 12,500 BDT' },
          ],
        },
        {
          key: 'noah' as const,
          label: 'Noah / Hiace',
          imageSrc: `/noah.png?v=${packageImageVersion}`,
          heading: 'Noah/Hiace Car Service Details',
          items: [
            'Car Models: Toyota Noah, Voxy, Hiace, Microbus, and more',
            { label: 'Basic Wash:', price: '৳ 900 BDT' },
            { label: 'Super Wash & Interior:', price: '৳ 1,500 BDT' },
            { label: 'Single stage polish:', price: '৳ 6,500 BDT' },
            { label: 'Basic Ceramic:', price: '৳ 10,000 BDT' },
            { label: 'Ceramic Care+:', price: '৳ 13,000 BDT' },
          ],
        },
      ] as const,
    []
  );

  const [activePackageTab, setActivePackageTab] = useState<PackageTabKey>('sedan');
  const activeTab = useMemo(
    () => packageTabs.find((tab) => tab.key === activePackageTab) ?? packageTabs[0],
    [activePackageTab, packageTabs]
  );

  const heroTitleFull = 'Premium Car Detailing at Your Doorstep';
  const [heroTitleTyped, setHeroTitleTyped] = useState('');

  const heroHighlightWord = 'Doorstep';
  const heroHighlightIndex = heroTitleFull.indexOf(heroHighlightWord);

  const [form, setForm] = useState<FormState>({
    service: 'Basic Wash',
    carType: 'Sedan',
    fullName: '',
    phone: '',
    address: '',
    dateTimeLocal: '',
    remarks: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<
    | { type: 'idle' }
    | { type: 'success'; message: string }
    | { type: 'error'; message: string }
  >({ type: 'idle' });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (!isSuccessModalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSuccessModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSuccessModalOpen]);

  const minDateTime = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }, []);

  const estimatedPrice = useMemo(() => getEstimatedPrice(form.service, form.carType), [form.service, form.carType]);

  const investmentLabel = useMemo(() => {
    if (!estimatedPrice) return '—';
    if (estimatedPrice.kind === 'exact') return formatBDT(estimatedPrice.amount);
    return `From ${formatBDT(estimatedPrice.amount)}`;
  }, [estimatedPrice]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isGateDone = () => (window as unknown as { __cvadBgGateDone?: boolean }).__cvadBgGateDone === true;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      setHeroTitleTyped(heroTitleFull);
      return;
    }

    let startTimer: number | null = null;
    let interval: number | null = null;

    const startTyping = () => {
      setHeroTitleTyped('');
      let index = 0;
      const startDelayMs = 200;
      const perCharMs = 28;

      startTimer = window.setTimeout(() => {
        interval = window.setInterval(() => {
          index += 1;
          setHeroTitleTyped(heroTitleFull.slice(0, index));
          if (index >= heroTitleFull.length) {
            if (interval) window.clearInterval(interval);
            interval = null;
          }
        }, perCharMs);
      }, startDelayMs);
    };

    const handleGateDone = () => startTyping();

    if (isGateDone()) {
      startTyping();
    } else {
      window.addEventListener('cvad:bgGateDone', handleGateDone as EventListener, { once: true } as AddEventListenerOptions);
    }

    return () => {
      window.removeEventListener('cvad:bgGateDone', handleGateDone as EventListener);
      if (startTimer) window.clearTimeout(startTimer);
      if (interval) window.clearInterval(interval);
    };
  }, [heroTitleFull]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: 'idle' });

    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim() || !form.dateTimeLocal) {
      setStatus({ type: 'error', message: 'Please fill out all required fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: form.service,
          carType: form.carType,
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          dateTimeLocal: form.dateTimeLocal,
          remarks: form.remarks,
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { status?: string; message?: string }
        | null;

      if (!response.ok) {
        setStatus({
          type: 'error',
          message: data?.message || 'Something went wrong. Please try again in a moment.',
        });
        return;
      }

      setStatus({
        type: 'success',
        message: 'Request submitted. We’ll contact you shortly to confirm the booking.',
      });
      setIsSuccessModalOpen(true);
      setForm((prev) => ({
        ...prev,
        fullName: '',
        phone: '',
        address: '',
        dateTimeLocal: '',
        remarks: '',
      }));
    } catch {
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again in a moment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const processSteps = [
    {
      key: 'confirmation',
      icon: <Phone className="h-5 w-5" aria-hidden="true" />,
      title: 'Confirmation',
      description: 'We call you to confirm the booking timing and share our availability.',
    },
    {
      key: 'inspection',
      icon: <Clipboard className="h-5 w-5" aria-hidden="true" />,
      title: 'Inspection & Assessment',
      description: 'We check your vehicle condition, paint, and priority areas before starting.',
    },
    {
      key: 'deep-clean',
      icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
      title: 'Deep Cleaning & Polishing',
      description: 'Thorough wash and detail work using safe products and proven methods.',
    },
    {
      key: 'handover',
      icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
      title: 'Final Inspection & Handover',
      description: 'We verify results, share care tips, and hand over a spotless finish.',
    },
  ] as const;

  return (
    <PageWrapper>
      <main className="bg-transparent font-sans text-slate-100">
        {isSuccessModalOpen && status.type === 'success' && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Booking request submitted"
          >
            <button
              type="button"
              className="absolute inset-0 z-0 bg-black/60"
              onClick={() => {
                setIsSuccessModalOpen(false);
                setStatus({ type: 'idle' });
              }}
              aria-label="Close"
            />

            <div
              className="relative z-10 w-full max-w-md rounded-2xl border border-gold-400/30 bg-slate-950/95 p-5 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-radiant-gold">Success</div>
                  <p className="mt-1 text-sm text-slate-200/85">{status.message}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    setStatus({ type: 'idle' });
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10"
                  aria-label="Close popup"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    setStatus({ type: 'idle' });
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-polish-gold px-4 text-sm font-semibold text-black transition hover:bg-gold-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero + Booking */}
        <section className="bg-transparent">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
                aria-label={heroTitleFull}
              >
                <span className="sr-only">{heroTitleFull}</span>
                <span aria-hidden="true">
                  {/* Mobile: concise 2-line headline */}
                  <span className="block md:hidden">
                    <span className="block">Premium Car Detailing</span>
                    <span className="block">at Your <span className="text-polish-gold">Doorstep</span></span>
                  </span>

                  {/* Desktop: typed headline with highlighted Doorstep */}
                  <span className="hidden md:inline">
                    {!heroTitleTyped ? (
                      <span>{'\u00A0'}</span>
                    ) : heroHighlightIndex >= 0 ? (
                      <>
                        <span>
                          {heroTitleTyped.slice(0, Math.min(heroTitleTyped.length, heroHighlightIndex))}
                        </span>
                        <span className="text-polish-gold">
                          {heroTitleTyped.slice(
                            heroHighlightIndex,
                            Math.min(heroTitleTyped.length, heroHighlightIndex + heroHighlightWord.length)
                          )}
                        </span>
                        <span>
                          {heroTitleTyped.slice(
                            Math.min(heroTitleTyped.length, heroHighlightIndex + heroHighlightWord.length)
                          )}
                        </span>
                      </>
                    ) : (
                      <span>{heroTitleTyped}</span>
                    )}
                    <span
                      className="ml-0.5 inline-block w-[0.55ch] animate-pulse rounded-sm bg-gold-200/80 align-[0.1em]"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </h1>


              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-slate-950/55 px-4 py-2 text-sm font-semibold text-slate-100 shadow-[0_12px_40px_-25px_rgba(0,0,0,0.8)] sm:text-base">
                  <MapPin className="h-4 w-4 text-gold-300" aria-hidden="true" />
                  <span>
                    <span className="text-polish-gold">Dhaka-based</span> <span className="text-slate-400">|</span> Professional-grade results, Wherever You Are.
                  </span>
                </div>
              </div>

              <ul className="grid max-w-xl gap-3 text-sm text-slate-200/90 sm:text-base">
                {[
                  'Car Exterior Wash Services',
                  'Interior Deep Cleaning + Exterior Wash',
                  'Premium Polish & Ceramic Protection',
                ].map((item, index) => (
                  <motion.li 
                    key={item} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-md border border-gold-400/30 bg-slate-950/60">
                      <Check className="h-4 w-4 text-gold-300" aria-hidden="true" />
                    </span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <GlassSurface
                  width="auto"
                  height="auto"
                  borderRadius={14}
                  backgroundOpacity={0.18}
                  saturation={1.35}
                  blur={18}
                  borderWidth={0.08}
                  tint="rgba(2, 6, 23, 0.55)"
                  className="inline-flex border border-gold-400/20"
                  style={{ padding: 0 }}
                >
                  <a
                    href={`tel:${PHONE_NUMBER_TEL}`}
                    className="inline-flex items-center gap-2 rounded-[14px] bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    aria-label={`Call ${PHONE_NUMBER_DISPLAY}`}
                  >
                    <Phone className="h-4 w-4 text-gold-300" aria-hidden="true" />
                    <span className="font-medium tracking-tight">Call {PHONE_NUMBER_DISPLAY}</span>
                  </a>
                </GlassSurface>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366] px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsAppLogo className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </motion.div>

            <motion.div 
              className="lg:pt-1"
              initial={{ opacity: 0, x: 30, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-2xl border border-gold-400/35 bg-slate-950/90 p-4 shadow-[0_0_0_1px_rgba(245,158,11,0.08),0_24px_60px_-30px_rgba(0,0,0,0.75)] sm:p-6">
                {/* Mobile: centered title */}
                <div className="flex flex-col items-center gap-1 sm:hidden">
                  <div className="flex items-center gap-2">
                    <Car className="h-6 w-6 text-gold-300" aria-hidden="true" />
                    <h2 className="text-xl font-semibold leading-tight text-radiant-gold whitespace-nowrap">Book Your Service Now</h2>
                  </div>
                  <p className="text-sm text-slate-200/80">
                    Submit a request and we’ll confirm availability.
                  </p>
                </div>

                {/* Desktop: original layout with estimated cost */}
                <div className="hidden sm:flex sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-gold-300 lg:h-7 lg:w-7" aria-hidden="true" />
                    <h2 className="text-xl font-semibold leading-tight text-radiant-gold lg:text-3xl">Book Your Service Now</h2>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-slate-200/80">
                      Estimated Cost = <span className="text-radiant-gold">{investmentLabel}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-1 hidden text-sm text-slate-200/80 sm:block">
                  Submit a request and we’ll confirm availability.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-200" htmlFor="service">
                        Select Service
                      </label>
                      <div className="relative">
                        <Wrench className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/80" aria-hidden="true" />
                        <select
                          id="service"
                          value={form.service}
                          onChange={(e) => setForm((p) => ({ ...p, service: e.target.value as ServiceOption }))}
                          className="h-10 w-full appearance-none rounded-lg border border-gold-400/20 bg-transparent pl-9 pr-9 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-gold-400/45"
                        >
                          <option className="bg-slate-950" value="Basic Wash">Basic Wash</option>
                          <option className="bg-slate-950" value="Super Wash & Interior">Super Wash & Interior</option>
                          <option className="bg-slate-950" value="Single-Stage Polish">Single-Stage Polish</option>
                          <option className="bg-slate-950" value="Glass Polish">Glass Polish</option>
                          <option className="bg-slate-950" value="Basic Ceramic (6-9 Months)">Basic Ceramic (6-9 Months)</option>
                          <option className="bg-slate-950" value="Ceramic Care+ (18-24 Months)">Ceramic Care+ (18-24 Months)</option>
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/80"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-200" htmlFor="carType">
                        Select Car Type
                      </label>
                      <div className="relative">
                        <Car className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/80" aria-hidden="true" />
                        <select
                          id="carType"
                          value={form.carType}
                          onChange={(e) => setForm((p) => ({ ...p, carType: e.target.value as CarTypeOption }))}
                          className="h-10 w-full appearance-none rounded-lg border border-gold-400/20 bg-transparent pl-9 pr-9 text-sm text-slate-100 outline-none focus:border-gold-400/45"
                        >
                          <option className="bg-slate-950" value="Sedan">Sedan</option>
                          <option className="bg-slate-950" value="SUV">SUV</option>
                          <option className="bg-slate-950" value="Microbus">Microbus</option>
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/80"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile: Estimated cost under car type */}
                  <div className="text-center sm:hidden">
                    <div className="text-xs font-semibold text-slate-200/80">
                      Estimated Cost = <span className="text-radiant-gold">{investmentLabel}</span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-200" htmlFor="fullName">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/80" aria-hidden="true" />
                        <input
                          id="fullName"
                          value={form.fullName}
                          onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                          className="h-10 w-full rounded-lg border border-gold-400/20 bg-transparent pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-gold-400/45"
                          placeholder="Your name"
                          autoComplete="name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-200" htmlFor="phone">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/80" aria-hidden="true" />
                        <input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          className="h-10 w-full rounded-lg border border-gold-400/20 bg-transparent pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-gold-400/45"
                          placeholder="01XXXXXXXXX"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-200" htmlFor="address">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/80" aria-hidden="true" />
                      <input
                        id="address"
                        value={form.address}
                        onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                        className="h-10 w-full rounded-lg border border-gold-400/20 bg-transparent pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-gold-400/45"
                        placeholder="Street, area, city"
                        autoComplete="street-address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-200" htmlFor="dateTime">
                      Date &amp; Time
                    </label>
                    <div className="relative">
                      <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/80" aria-hidden="true" />
                      <input
                        id="dateTime"
                        type="datetime-local"
                        min={minDateTime}
                        value={form.dateTimeLocal}
                        onChange={(e) => setForm((p) => ({ ...p, dateTimeLocal: e.target.value }))}
                        className={classNames(
                          'h-10 w-full rounded-lg border bg-transparent pl-9 pr-3 text-sm outline-none',
                          'border-gold-400/20 text-slate-100 focus:border-gold-400/45',
                        )}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-200" htmlFor="remarks">
                      Remarks
                    </label>
                    <div className="relative">
                      <textarea
                        id="remarks"
                        value={form.remarks}
                        onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))}
                        className="min-h-[96px] w-full resize-none rounded-lg border border-gold-400/20 bg-transparent px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-gold-400/45"
                        placeholder="Any notes (preferred time, exact location, special requests, etc.)"
                        maxLength={1000}
                      />
                    </div>
                  </div>

                  {status.type === 'error' && (
                    <div
                      className={classNames(
                        'rounded-lg border px-3 py-1.5 text-sm',
                        'border-rose-400/30 bg-rose-950/40 text-rose-100',
                      )}
                      role="status"
                      aria-live="polite"
                    >
                      {status.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-polish-gold inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-black transition hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit Request'}
                  </button>

                  <p className="text-xs text-slate-200/70">
                    By submitting, you agree we may contact you to confirm your booking.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <SectionTransition className="bg-transparent">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-12">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">Our Simple 4-Step Process</h2>
              <div className="mt-2 text-sm text-slate-200/70">Fast • Clean • Verified</div>
            </div>
          </FadeIn>

          <ol className="relative mt-8 pt-10 space-y-6 md:grid md:grid-cols-4 md:gap-4 md:space-y-0">
            <div className="pointer-events-none absolute left-6 right-6 top-10 hidden h-px bg-linear-to-r from-transparent via-gold-400/35 to-transparent md:block" />

            {processSteps.map((step, index) => (
              <motion.li 
                key={step.key} 
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div 
                  className="relative rounded-2xl border border-gold-400/20 bg-slate-950/90 p-5"
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Number outside the card */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold-400 text-[12px] font-bold text-black shadow-[0_10px_30px_-15px_rgba(245,158,11,0.9)]">
                      {index + 1}
                    </span>
                  </div>

                  {/* Icon inside the card */}
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/25 bg-slate-950/50 text-gold-300">
                      {step.icon}
                    </span>
                    <div className="text-base font-semibold text-radiant-gold">{step.title}</div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200/80">{step.description}</p>
                </motion.div>
              </motion.li>
            ))}
          </ol>
        </div>
      </SectionTransition>

      {/* Services & Pricing */}
      <SectionTransition className="bg-transparent" delay={0.1}>
        <div className="mx-auto w-full max-w-[1400px] px-4 py-12">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Available Service Packages and Pricing</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-200/80 sm:text-base">
                Keep your car clean, shiny, and well-maintained with Crystal Valley.
              </p>
            </div>
          </FadeIn>

          <div className="mt-8 flex flex-nowrap items-center justify-center gap-3 overflow-x-auto pb-2 sm:overflow-visible sm:pb-0">
            {packageTabs.map((tab) => {
              const isActive = tab.key === activePackageTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActivePackageTab(tab.key)}
                  className={`shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300 sm:px-5 ${
                    isActive
                      ? 'border border-gold-400/40 bg-slate-950 text-radiant-gold'
                      : 'border border-white/10 bg-slate-950/60 text-white hover:border-gold-400/30 hover:bg-slate-950/80'
                  }`}
                  style={{ borderRadius: 8 }}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid items-start gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-2">
            <div className="relative">
              <div className="relative aspect-video w-full sm:aspect-4/3">
                {packageTabs.map((tab) => {
                  const isActive = tab.key === activePackageTab;
                  return (
                    <motion.div
                      key={tab.key}
                      initial={false}
                      animate={isActive ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 0, scale: 1 }}
                      transition={isActive ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] } : { duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      className="pointer-events-none absolute inset-0 sm:-translate-x-11"
                      style={{ zIndex: isActive ? 1 : 0 }}
                      aria-hidden={!isActive}
                    >
                      <Image
                        src={tab.imageSrc}
                        alt={`${tab.label} package image`}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="translate-y-2 scale-[1.45] object-contain object-center drop-shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:-translate-y-20 sm:scale-[1.24] sm:object-bottom-left lg:-translate-y-28 lg:scale-[1.34]"
                        draggable={false}
                        priority
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[680px] rounded-2xl border border-white/10 bg-slate-950/40 p-6 sm:p-8 lg:mx-0 lg:max-w-none">
              <h3 className="text-xl font-bold text-white sm:text-2xl">{activeTab.heading}</h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-100/90 sm:mt-5 sm:text-base">
                {activeTab.items.map((item) => {
                  if (typeof item === 'string') {
                    return (
                      <li key={item} className="leading-relaxed">
                        {item}
                      </li>
                    );
                  }

                  return (
                    <li key={item.label} className="leading-relaxed">
                      <span>{item.label} </span>
                      <span className="font-semibold text-radiant-gold">{item.price}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => document.getElementById('fullName')?.focus()}
                  className="inline-flex items-center justify-center bg-polish-gold px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
                  style={{ borderRadius: 8 }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </SectionTransition>

      {/* Flyer Sections */}
      <section className="bg-transparent space-y-24 py-12 lg:py-20">
        {/* Flyer 1 */}
        <div className="mx-auto w-full max-w-[1400px] px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SlideIn direction="left" className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Droplets className="h-3.5 w-3.5" />
                <span>Wash Service</span>
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Car Exterior Wash Service</h2>
              <p className="text-lg font-medium text-slate-200">A perfect choice for quick and effective cleaning.</p>
              <p className="text-base text-slate-300/90 leading-relaxed">
                We use high-pressure water, gentle foam, and eco-friendly shampoo to remove dirt and grime while protecting your car&apos;s paint.
              </p>
              
              <div className="space-y-4 pt-2">
                <h3 className="font-semibold text-radiant-gold">Car Exterior Wash Services Includes:</h3>
                <ul className="grid gap-3 sm:grid-cols-1">
                  {[
                    "Complete exterior body wash",
                    "Tire and rim cleaning",
                    "Glass and mirror cleaning",
                    "Streak-free drying"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400/20">
                        <Check className="h-3 w-3 text-gold-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                 <motion.button 
                   onClick={() => document.getElementById('fullName')?.focus()}
                   className="bg-polish-gold inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-bold text-black transition hover:brightness-110 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]"
                   whileHover={{ scale: 1.05, y: -2 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   Book Now
                 </motion.button>
              </div>
            </SlideIn>
            
            {/* Visual Side */}
            <ScrollReveal variant="scale" className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-800 lg:order-last">
               <Image
                 src={`/wash.png?v=${serviceImageVersion}`}
                 alt="Car exterior wash service"
                 fill
                 sizes="(min-width: 1024px) 50vw, 100vw"
                 className="object-cover object-center"
               />
               <div className="absolute inset-0 bg-linear-to-br from-blue-950/35 via-slate-950/20 to-slate-950/70" />
               {/* Flyer Overlay Look */}
               <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-slate-950/90 to-transparent p-8">
                  <motion.div 
                    className="inline-block rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Exterior Wash
                  </motion.div>
               </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Flyer 2 */}
        <div className="mx-auto w-full max-w-[1400px] px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
             {/* Visual Side (Left on Desktop) */}
            <ScrollReveal
              variant="scale"
              className="order-last relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-800 lg:order-first"
            >
               <Image
                 src={`/Interior.png?v=${serviceImageVersion}`}
                 alt="Interior deep cleaning and exterior wash service"
                 fill
                 sizes="(min-width: 1024px) 50vw, 100vw"
                 className="object-cover object-center"
               />
               <div className="absolute inset-0 bg-linear-to-br from-emerald-950/30 via-slate-950/15 to-slate-950/70" />
               <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-slate-950/90 to-transparent p-8">
                  <motion.div 
                    className="inline-block rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Deep Clean
                  </motion.div>
               </div>
            </ScrollReveal>

            <SlideIn direction="right" className="order-first space-y-6 lg:order-last">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Interior & Exterior</span>
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Interior Deep Clean + Exterior Wash</h2>
              <p className="text-lg font-medium text-slate-200">Ideal for a full car refresh. Clean both inside and outside of your car.</p>
              <p className="text-base text-slate-300/90 leading-relaxed">
                Our trained team carefully cleans your car&apos;s interior and exterior with specialized tools and safe detergents.
              </p>
              
              <div className="space-y-4 pt-2">
                <h3 className="font-semibold text-radiant-gold">Deep Cleaning + Exterior Wash Services Includes:</h3>
                <ul className="grid gap-3 sm:grid-cols-1">
                  {[
                    "Exterior foam wash",
                    "Dashboard and console cleaning",
                    "Carpet and seat vacuum",
                    "Door and handle polish",
                    "Glass and mirror shine",
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center gap-3 text-sm text-slate-200"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400/20">
                        <Check className="h-3 w-3 text-gold-400" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                 <motion.button 
                   onClick={() => document.getElementById('fullName')?.focus()}
                   className="bg-polish-gold inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-bold text-black transition hover:brightness-110 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]"
                   whileHover={{ scale: 1.05, y: -2 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   Book Now
                 </motion.button>
              </div>
            </SlideIn>
          </div>
        </div>

        {/* Flyer 3 */}
        <div className="mx-auto w-full max-w-[1400px] px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SlideIn direction="left" className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Premium Protection</span>
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Polish & Ceramic Protection</h2>
              <p className="text-lg font-medium text-slate-200">Restore showroom shine and lock it in with long-lasting protection.</p>
              <p className="text-base text-slate-300/90 leading-relaxed">
                Eliminate swirls and scratches while adding a hydrophobic ceramic layer that repels water and dirt for months.
              </p>
              
              <div className="space-y-4 pt-2">
                <h3 className="font-semibold text-radiant-gold">Premium Polish & Ceramic Services Includes:</h3>
                <ul className="grid gap-3 sm:grid-cols-1">
                  {[
                    "Detailed exterior wash",
                    "Multi-stage machine polish using professional-grade compounds",
                    "Ceramic coating application",
                    "Haze & swirl removal",
                    "Hydrophobic water repellency",
                    "Long-lasting gloss finish"

                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400/20">
                        <Check className="h-3 w-3 text-gold-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                 <motion.button 
                   onClick={() => document.getElementById('fullName')?.focus()}
                   className="bg-polish-gold inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-bold text-black transition hover:brightness-110 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]"
                   whileHover={{ scale: 1.05, y: -2 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   Book Now
                 </motion.button>
              </div>
            </SlideIn>
            
            {/* Visual Side */}
            <ScrollReveal variant="scale" className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-800 lg:order-last">
               <Image
                 src={`/ceramic.png?v=${serviceImageVersion}`}
                 alt="Ceramic coating and polish service"
                 fill
                 sizes="(min-width: 1024px) 50vw, 100vw"
                 className="object-cover object-center"
               />
               <div className="absolute inset-0 bg-linear-to-br from-purple-950/30 via-slate-950/15 to-slate-950/70" />
               <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-slate-950/90 to-transparent p-8">
                  <motion.div 
                    className="inline-block rounded-xl bg-purple-600 px-4 py-2 font-bold text-white shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Ceramic & Polish
                  </motion.div>
               </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Choose Crystal Valley Section */}
      <SectionTransition className="bg-transparent">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-12 lg:py-16">
          <FadeIn className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">Why Choose Crystal Valley?</h2>
            <p className="mt-3 text-sm text-slate-200/80">Premium service, ultimate convenience, and guaranteed satisfaction.</p>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Car className="h-6 w-6 text-gold-400" />,
                title: "Convenience",
                desc: "No driving to car washes—we come to your home or office."
              },
              {
                icon: <Briefcase className="h-6 w-6 text-gold-400" />,
                title: "Expert Cleaners",
                desc: "Trained professionals with gentle, thorough techniques."
              },
              {
                icon: <Leaf className="h-6 w-6 text-gold-400" />,
                title: "Eco-Friendly",
                desc: "Safe chemicals that protect your paints and interior."
              },
              {
                icon: <Clock className="h-6 w-6 text-gold-400" />,
                title: "Prompt Service",
                desc: "We arrive within 30-60 minutes of your booking, depending on availability."
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="group relative rounded-2xl border border-gold-400/20 bg-slate-950/80 p-6 transition-colors hover:bg-slate-900/80"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}
              >
                <motion.div 
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold-400/30 bg-gold-400/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold text-slate-100 group-hover:text-gold-300">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-300/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionTransition>

    </main>
    </PageWrapper>
  );
}
