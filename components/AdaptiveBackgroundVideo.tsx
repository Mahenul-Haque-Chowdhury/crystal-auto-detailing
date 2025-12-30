"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type VideoTier = "off" | "low" | "high";

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

const PLAYHEAD_STORAGE_KEY = "cvad:bgVideoPlayheadSeconds:v1";

const readStoredPlayheadSeconds = (): number | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PLAYHEAD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const storePlayheadSeconds = (seconds: number) => {
  if (typeof window === "undefined") return;
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  try {
    window.sessionStorage.setItem(PLAYHEAD_STORAGE_KEY, seconds.toString());
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
};

function getVideoTier(): VideoTier {
  if (typeof window === "undefined") return "high";

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReducedMotion) return "off";

  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (connection?.saveData) return "off";

  const effectiveType = connection?.effectiveType ?? "";
  if (effectiveType === "slow-2g" || effectiveType === "2g") return "off";
  if (effectiveType === "3g") return "low";

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof deviceMemory === "number" && deviceMemory <= 2) return "low";

  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores > 0 && cores <= 4) return "low";

  const ua = navigator.userAgent ?? "";
  const isAndroid = /Android/i.test(ua);
  if (isAndroid) return "low";

  const isSmallViewport = window.matchMedia?.("(max-width: 640px)")?.matches;
  if (isSmallViewport) return "low";

  return "high";
}

export default function AdaptiveBackgroundVideo() {
  const [tier, setTier] = useState<VideoTier>("high");
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const tierTimeoutId = window.setTimeout(() => {
      setTier(getVideoTier());
    }, 0);

    const idleCallback = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    }).requestIdleCallback;

    if (idleCallback) {
      const id = idleCallback(() => setShouldLoad(true), { timeout: 800 });
      return () => {
        window.clearTimeout(tierTimeoutId);
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
      };
    }

    const timeoutId = window.setTimeout(() => setShouldLoad(true), 250);
    return () => {
      window.clearTimeout(tierTimeoutId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        return;
      }

      // Best-effort resume; autoplay can still be blocked by some browsers.
      void video.play().catch(() => undefined);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [shouldLoad, tier]);

  const src = useMemo(() => {
    if (tier === "high") return "/background-720.mp4";
    if (tier === "low") return "/background-480.mp4";
    return null;
  }, [tier]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !src) return;

    video.dataset.ready = "false";

    let lastStoredAt = 0;

    const persistPlayhead = () => {
      const now = Date.now();
      if (now - lastStoredAt < 900) return;
      lastStoredAt = now;
      storePlayheadSeconds(video.currentTime);
    };

    const restoreAndPlay = () => {
      const storedSeconds = readStoredPlayheadSeconds();
      if (
        typeof storedSeconds === "number" &&
        Number.isFinite(video.duration) &&
        storedSeconds > 0 &&
        storedSeconds < Math.max(0, video.duration - 0.25)
      ) {
        try {
          video.currentTime = storedSeconds;
        } catch {
          // Some browsers may block programmatic seeking until enough data is buffered.
        }
      }

      // Best-effort start; muted videos generally allow autoplay.
      void video.play().catch(() => undefined);
    };

    const markVisible = () => {
      video.dataset.ready = "true";
    };

    video.addEventListener("timeupdate", persistPlayhead);
    video.addEventListener("pause", persistPlayhead);
    video.addEventListener("loadedmetadata", restoreAndPlay);
    video.addEventListener("canplay", markVisible, { once: true });
    video.addEventListener("playing", markVisible, { once: true });
    window.addEventListener("pagehide", persistPlayhead);

    if (video.readyState >= 1) {
      restoreAndPlay();
    }

    return () => {
      video.removeEventListener("timeupdate", persistPlayhead);
      video.removeEventListener("pause", persistPlayhead);
      video.removeEventListener("loadedmetadata", restoreAndPlay);
      video.removeEventListener("canplay", markVisible);
      video.removeEventListener("playing", markVisible);
      window.removeEventListener("pagehide", persistPlayhead);
    };
  }, [shouldLoad, src]);

  if (tier === "off") {
    return null;
  }

  return (
    <video
      ref={videoRef}
      data-ready="false"
      className="media-guard fixed inset-0 h-svh w-screen object-cover opacity-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none data-[ready=true]:opacity-100"
      loop
      muted
      playsInline
      preload={shouldLoad ? "metadata" : "none"}
      poster="/background-poster.jpg"
      aria-hidden="true"
      controls={false}
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      disableRemotePlayback
      draggable={false}
      tabIndex={-1}
      onContextMenu={(event) => event.preventDefault()}
    >
      {shouldLoad && src ? <source src={src} type="video/mp4" /> : null}
      {shouldLoad ? <source src="/background.mp4" type="video/mp4" /> : null}
    </video>
  );
}
