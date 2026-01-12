import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

import AdaptiveBackgroundVideo from "@/components/AdaptiveBackgroundVideo";
import BackgroundVideoGate from "@/components/BackgroundVideoGate";
import SiteChrome from "@/components/SiteChrome";
import { MotionProvider } from "@/components/animations";

const crystalGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-crystal-grotesk",
});

export const metadata: Metadata = {
  title: "Crystal Valley Auto Detail",
  description: "Luxury detailing packages with on-demand discount generator.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${crystalGrotesk.variable} antialiased`}
        suppressHydrationWarning
      >
        <MotionProvider>
          <div className="relative min-h-dvh overflow-x-hidden">
            {/* Global background (video only) */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950 to-black" />
              <AdaptiveBackgroundVideo className="absolute inset-0 h-full w-full scale-105 object-cover object-center" />
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
