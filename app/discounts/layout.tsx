import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exclusive Discounts",
  description:
    "Generate your exclusive discount for Crystal Valley Auto Detail car detailing services in Dhaka. Save on ceramic coating, interior cleaning and more.",
  openGraph: {
    title: "Exclusive Discounts - Crystal Valley Auto Detail",
    description:
      "Get an exclusive discount on premium car detailing services in Dhaka.",
    url: "https://crystalvalley.autos/discounts",
  },
};

export default function DiscountsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
