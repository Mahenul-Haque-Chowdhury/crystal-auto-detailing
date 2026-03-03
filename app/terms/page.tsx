import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions for using Crystal Valley Auto Detail services and website.',
  openGraph: {
    title: 'Terms of Use - Crystal Valley Auto Detail',
    description: 'Terms and conditions for our car detailing services.',
    url: 'https://crystalvalley.autos/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in-up">
      <h1 className="text-3xl font-bold text-radiant-gold sm:text-4xl">
        Terms of Use
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
