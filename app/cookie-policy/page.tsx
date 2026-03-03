import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Crystal Valley Auto Detail cookie policy — how we use cookies and similar technologies on our website.',
  openGraph: {
    title: 'Cookie Policy — Crystal Valley Auto Detail',
    description: 'How we use cookies on our website.',
    url: 'https://crystalvalley.autos/cookie-policy',
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in-up">
      <h1 className="text-3xl font-bold text-radiant-gold sm:text-4xl">
        Cookie Policy
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
