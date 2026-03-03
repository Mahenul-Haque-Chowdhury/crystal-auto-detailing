import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services & Pricing",
  description:
    "Explore Crystal Valley Auto Detail's car detailing packages: Basic Wash, Super Wash & Interior, Single-Stage Polish, Ceramic Coating and more for Sedan, SUV & Microbus in Dhaka.",
  openGraph: {
    title: "Services & Pricing - Crystal Valley Auto Detail",
    description:
      "Premium car detailing packages in Dhaka. Compare pricing for Sedan, SUV & Microbus.",
    url: "https://crystalvalley.autos/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
