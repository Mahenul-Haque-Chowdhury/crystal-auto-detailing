"use client";

import { usePathname } from "next/navigation";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname === "/discounts" || pathname.startsWith("/discounts/");

  return (
    <>
      <SiteHeader />
      <div
        className="relative flex min-h-dvh flex-col"
        style={{ paddingTop: "var(--site-header-h, 0px)" }}
      >
        <main className="flex-1">{children}</main>
        {!hideFooter ? <SiteFooter /> : null}
      </div>
    </>
  );
}
