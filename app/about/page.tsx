"use client";

import Link from "next/link";
import GlassSurface from "@/components/GlassSurface";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem, PageWrapper } from "@/components/animations";

const CALL_NOW_TEL = "tel:+8801XXXXXXXXX";

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <FadeIn>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                About <span className="text-radiant-gold">Crystal Valley</span>
              </h1>
            </FadeIn>

            <SlideIn direction="up" delay={0.05}>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-200/90">
                We’re a detail-first team focused on sharp finishes, safe methods, and a consistent
                “just detailed” look—every time. From quick refreshes to deep correction work, we
                treat every vehicle like it’s our own.
              </p>
            </SlideIn>

            <SlideIn direction="up" delay={0.12}>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/discounts"
                  className="inline-flex items-center justify-center rounded-full bg-polish-gold px-6 py-3 text-sm font-extrabold text-black transition hover:brightness-110 active:scale-95"
                >
                  View Discounts
                </Link>
                <a
                  href={CALL_NOW_TEL}
                  className="inline-flex items-center justify-center rounded-full border border-gold-300/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 hover:text-gold-50 active:scale-95"
                >
                  Call Now
                </a>
              </div>
            </SlideIn>
          </div>

          <SlideIn direction="up" delay={0.08}>
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={22}
              backgroundOpacity={0.14}
              saturation={1.35}
              tint="rgba(2, 6, 23, 0.55)"
              className="border border-gold-400/15"
            >
              <div className="p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">
                  What we care about
                </div>
                <div className="mt-4 grid gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-base font-semibold text-white">Safe techniques</div>
                    <div className="mt-1 text-sm text-slate-200/80">
                      Proper wash process, clean tools, and paint-friendly contact.
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-base font-semibold text-white">Real results</div>
                    <div className="mt-1 text-sm text-slate-200/80">
                      Crisp gloss, clean interiors, and details you can actually feel.
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-base font-semibold text-white">Clear communication</div>
                    <div className="mt-1 text-sm text-slate-200/80">
                      Straightforward recommendations and transparent pricing.
                    </div>
                  </div>
                </div>
              </div>
            </GlassSurface>
          </SlideIn>
        </div>

        <div className="mt-14">
          <FadeIn>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Our process
            </h2>
          </FadeIn>

          <SlideIn direction="up" delay={0.05}>
            <p className="mt-3 max-w-3xl text-slate-200/80">
              A consistent, professional workflow—so you always know what you’re getting.
            </p>
          </SlideIn>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <StaggerChildren>
              {[
                {
                  title: "Inspect",
                  body: "We review paint, wheels, trim, and interior condition before touching anything.",
                },
                {
                  title: "Detail",
                  body: "We work panel-by-panel and zone-by-zone with safe products and clean tools.",
                },
                {
                  title: "Finish",
                  body: "Final wipe-down, glass check, and a walk-through so you can see the difference.",
                },
              ].map((step) => (
                <StaggerItem key={step.title}>
                  <GlassSurface
                    width="100%"
                    height="auto"
                    borderRadius={18}
                    backgroundOpacity={0.12}
                    saturation={1.25}
                    tint="rgba(2, 6, 23, 0.5)"
                    className="border border-white/10"
                  >
                    <div className="p-5">
                      <div className="text-lg font-bold text-white">{step.title}</div>
                      <div className="mt-2 text-sm leading-relaxed text-slate-200/80">
                        {step.body}
                      </div>
                    </div>
                  </GlassSurface>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>

        <div className="mt-14">
          <FadeIn>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Founder’s message
            </h2>
          </FadeIn>

          <SlideIn direction="up" delay={0.05}>
            <p className="mt-3 max-w-3xl text-slate-200/80">
              A note from the person behind Crystal Valley Auto Detail.
            </p>
          </SlideIn>

          <div className="mt-6">
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={22}
              backgroundOpacity={0.14}
              saturation={1.35}
              tint="rgba(2, 6, 23, 0.55)"
              className="border border-gold-400/15"
            >
              <div className="space-y-4 p-7 text-sm leading-relaxed text-slate-200/85 sm:text-base">
                <p>
                  Crystal Valley Auto Detail began with passion and courage. I started this journey with one simple
                  belief: when you put your heart into your work, people feel it.
                </p>
                <p>
                  We may be a young business, but our commitment is strong. Every car is treated with care, honesty, and
                  attention because trust matters.
                </p>
                <p>
                  Thank you for supporting our journey. Your trust motivates us to build something meaningful and
                  lasting.
                </p>
                <div className="pt-2 text-slate-200/90">
                  <div>-</div>
                  <div className="mt-2 font-semibold text-white">Riffat Tonmoy</div>
                  <div className="text-slate-200/80">Founder</div>
                  <div className="text-slate-200/80">Crystal Valley Auto Detail</div>
                </div>
              </div>
            </GlassSurface>
          </div>
        </div>

        <div className="mt-14">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={22}
            backgroundOpacity={0.16}
            saturation={1.35}
            tint="rgba(2, 6, 23, 0.55)"
            className="border border-gold-400/15"
          >
            <div className="flex flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center">
              <div>
                <div className="text-2xl font-extrabold tracking-tight text-white">
                  Want your car to look freshly detailed again?
                </div>
                <div className="mt-2 text-sm text-slate-200/80">
                  Check current discounts or call to book.
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/discounts"
                  className="inline-flex items-center justify-center rounded-full bg-polish-gold px-6 py-3 text-sm font-extrabold text-black transition hover:brightness-110 active:scale-95"
                >
                  Discounts
                </Link>
                <a
                  href={CALL_NOW_TEL}
                  className="inline-flex items-center justify-center rounded-full border border-gold-300/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 hover:text-gold-50 active:scale-95"
                >
                  Call now
                </a>
              </div>
            </div>
          </GlassSurface>
        </div>
      </div>
    </PageWrapper>
  );
}
