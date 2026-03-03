import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the Crystal Valley Auto Detail team - passionate car care professionals in Dhaka.',
  openGraph: {
    title: 'Our Team - Crystal Valley Auto Detail',
    description: 'Meet the team behind Dhaka\'s premium car detailing service.',
    url: 'https://crystalvalley.autos/team',
  },
};

export default function TeamPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in-up">
      <h1 className="text-3xl font-bold text-radiant-gold sm:text-4xl">
        Our Team
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
