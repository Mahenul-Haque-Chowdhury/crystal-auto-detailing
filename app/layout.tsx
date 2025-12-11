import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const crystalGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-crystal-grotesk",
});

export const metadata: Metadata = {
  title: "Crystal Auto Detailing",
  description: "Luxury detailing packages with on-demand discount generator.",
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
        {children}
      </body>
    </html>
  );
}
