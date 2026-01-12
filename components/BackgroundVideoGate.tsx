"use client";

import { useEffect, useState } from "react";

import CarProgressLoader from "@/components/CarProgressLoader";

const WARM_KEY = "cvad:bgVideoWarm:v1";
const READY_EVENT = "cvad:bgVideoReady";
const DISABLED_EVENT = "cvad:bgVideoDisabled";
const ERROR_EVENT = "cvad:bgVideoError";
const GATE_DONE_EVENT = "cvad:bgGateDone";

const markGateDone = () => {
  if (typeof window === "undefined") return;
  (window as unknown as { __cvadBgGateDone?: boolean }).__cvadBgGateDone = true;
  window.dispatchEvent(new Event(GATE_DONE_EVENT));
};

export default function BackgroundVideoGate() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(WARM_KEY) !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    // If the gate is skipped (warm session), still unblock animations.
    if (!show) markGateDone();
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const markWarmAndHide = () => {
      try {
        window.sessionStorage.setItem(WARM_KEY, "1");
      } catch {
        // ignore
      }
      setShow(false);
      markGateDone();
    };

    const onReady = () => markWarmAndHide();
    const onDisabled = () => markWarmAndHide();
    const onError = () => markWarmAndHide();

    window.addEventListener(READY_EVENT, onReady as EventListener);
    window.addEventListener(DISABLED_EVENT, onDisabled as EventListener);
    window.addEventListener(ERROR_EVENT, onError as EventListener);

    // Safety timeout: never block the UI forever.
    const timeoutId = window.setTimeout(markWarmAndHide, 6500);

    return () => {
      window.removeEventListener(READY_EVENT, onReady as EventListener);
      window.removeEventListener(DISABLED_EVENT, onDisabled as EventListener);
      window.removeEventListener(ERROR_EVENT, onError as EventListener);
      window.clearTimeout(timeoutId);
    };
  }, [show]);

  if (!show) return null;

  return <CarProgressLoader variant="overlay" />;
}
