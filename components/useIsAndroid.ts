"use client";

import { useEffect, useState } from "react";

export function useIsAndroid() {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent ?? "";
    setIsAndroid(/Android/i.test(ua));
  }, []);

  return isAndroid;
}
