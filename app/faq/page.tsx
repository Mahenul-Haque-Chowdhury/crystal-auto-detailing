import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about Crystal Valley Auto Detail’s car detailing services, pricing, and booking in Dhaka.',
  openGraph: {
    title: 'FAQs - Crystal Valley Auto Detail',
    description: 'Answers to common questions about our car detailing services.',
    url: 'https://crystalvalley.autos/faq',
  },
};

export default function FAQPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in-up">
      <h1 className="text-3xl font-bold text-radiant-gold sm:text-4xl">
        FAQs
      </h1>
      <p className="mt-4 max-w-md text-lg text-slate-300 animate-fade-in-up [animation-delay:100ms]">
        This page is currently under construction. Please check back later.
      </p>
      <div className="animate-fade-in-up [animation-delay:200ms]">
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-polish-gold px-8 py-3 font-semibold text-black transition hover:brightness-110 hover:scale-105 active:scale-95"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
