import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Crystal Valley Auto Detail — Dhaka's premium mobile car detailing service founded by Riffat Tonmoy. Our story, values and commitment to quality.",
  openGraph: {
    title: "About — Crystal Valley Auto Detail",
    description:
      "Dhaka's premium mobile car detailing service. Safe techniques, real results, clear communication.",
    url: "https://crystalvalley.autos/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
