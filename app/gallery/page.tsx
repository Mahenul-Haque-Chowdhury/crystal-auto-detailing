import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description: "Browse Crystal Valley Auto Detail\u2019s car detailing gallery \u2014 see our work on ceramic coating, interior cleaning and polishing in Dhaka.",
  openGraph: {
    title: "Gallery \u2014 Crystal Valley Auto Detail",
    description: 'See our premium car detailing work in Dhaka.',
    url: 'https://crystalvalley.autos/gallery',
  },
};

export default function GalleryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
      <p className="text-xl text-neutral-400">Coming Soon</p>
    </div>
  );
}
