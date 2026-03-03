import type { Metadata } from "next";
import { headers } from "next/headers";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import BackgroundMedia from "@/components/BackgroundMedia";
import BackgroundVideoGate from "@/components/BackgroundVideoGate";
import SiteChrome from "@/components/SiteChrome";
import { MotionProvider } from "@/components/animations";
import JsonLd from "@/components/JsonLd";

const crystalGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-crystal-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://crystalvalley.autos"),
  title: {
    default: "Crystal Valley Auto Detail - Premium Car Detailing in Dhaka",
    template: "%s | Crystal Valley Auto Detail",
  },
  description:
    "Dhaka's premium mobile car detailing service. Ceramic coating, interior deep cleaning, single-stage polish & more - delivered to your doorstep. Book online now.",
  keywords: [
    "car detailing Dhaka",
    "ceramic coating Bangladesh",
    "mobile car wash Dhaka",
    "interior deep cleaning",
    "Crystal Valley Auto Detail",
    "premium car care",
  ],
  authors: [{ name: "Crystal Valley Auto Detail" }],
  creator: "Crystal Valley Auto Detail",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crystalvalley.autos",
    siteName: "Crystal Valley Auto Detail",
    title: "Crystal Valley Auto Detail - Premium Car Detailing in Dhaka",
    description:
      "Ceramic coating, interior deep cleaning, single-stage polish & more - delivered to your doorstep in Dhaka.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Crystal Valley Auto Detail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crystal Valley Auto Detail - Premium Car Detailing in Dhaka",
    description:
      "Ceramic coating, interior deep cleaning, single-stage polish & more - delivered to your doorstep in Dhaka.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ua = (await headers()).get("user-agent") ?? "";
  const initialIsAndroid = /Android/i.test(ua);

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${crystalGrotesk.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GETR2PV4P1"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-GETR2PV4P1');`}
        </Script>
        <MotionProvider>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://crystalvalley.autos/#business",
              name: "Crystal Valley Auto Detail",
              description:
                "Dhaka's premium mobile car detailing service - ceramic coating, interior deep cleaning, single-stage polish and more.",
              url: "https://crystalvalley.autos",
              email: "riffattonmoy@crystalvalley.autos",
              telephone: "+8801841353850",
              image: "https://crystalvalley.autos/og-image.png",
              priceRange: "৳৳",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dhaka",
                addressCountry: "BD",
              },
              areaServed: {
                "@type": "City",
                name: "Dhaka",
              },
              founder: {
                "@type": "Person",
                name: "Riffat Tonmoy",
                url: "https://riffattonmoy.online/",
              },
              sameAs: [],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Car Detailing Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Basic Wash",
                      description: "Exterior wash with safe techniques.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Super Wash & Interior Deep Cleaning",
                      description:
                        "Full exterior wash and interior deep cleaning package.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Single-Stage Polish",
                      description:
                        "Paint correction with single-stage machine polish for lasting gloss.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Ceramic Coating",
                      description:
                        "Professional ceramic coating for long-term paint protection.",
                    },
                  },
                ],
              },
            }}
          />
          <div className="relative min-h-dvh overflow-x-hidden">
            {/* Global background (video only) */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950 to-black" />
              <BackgroundMedia
                initialIsAndroid={initialIsAndroid}
                className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
              />
              <div className="backdrop-fade absolute inset-0" />
            </div>

            <SiteChrome>{children}</SiteChrome>
            <BackgroundVideoGate />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
