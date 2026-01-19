"use client";

import { useEffect, useState } from "react";

import AdaptiveBackgroundVideo from "@/components/AdaptiveBackgroundVideo";
import AndroidHeroSlideshow from "@/components/AndroidHeroSlideshow";

type BackgroundMediaProps = {
  className?: string;
  initialIsAndroid?: boolean;
};

export default function BackgroundMedia({ className = "", initialIsAndroid = false }: BackgroundMediaProps) {
  const [isAndroid, setIsAndroid] = useState(initialIsAndroid);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent ?? "";
    setIsAndroid(/Android/i.test(ua));
  }, []);

  return isAndroid ? (
    <AndroidHeroSlideshow className={className} />
  ) : (
    <AdaptiveBackgroundVideo className={className} />
  );
}
