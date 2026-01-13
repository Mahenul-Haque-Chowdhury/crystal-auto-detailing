"use client";

import GlassSurface from "@/components/GlassSurface";
import { FadeIn, SlideIn, PageWrapper } from "@/components/animations";

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <SlideIn direction="up" delay={0.05}>
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

          <div>
            <FadeIn>
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Founder’s message
              </h2>
            </FadeIn>

            <SlideIn direction="up" delay={0.06}>
              <p className="mt-2 text-sm font-medium text-slate-200/80 sm:text-base">
                Hear from the man behind Crystal Valley
              </p>
            </SlideIn>

            <SlideIn direction="up" delay={0.08}>
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
                      We may be a young business, but our commitment is strong. Every car is treated with care, honesty,
                      and attention because trust matters.
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

                    <div className="pt-2">
                      <a
                        href="https://riffattonmoy.online/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-gold-300/40 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 hover:text-gold-50 active:scale-95"
                      >
                        Visit Riffat Tonmoy&apos;s Portfolio
                      </a>
                    </div>
                  </div>
                </GlassSurface>
              </div>
            </SlideIn>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
