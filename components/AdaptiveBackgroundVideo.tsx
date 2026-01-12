"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type VideoTier = "off" | "p540" | "p720" | "p1080";

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

const PLAYHEAD_STORAGE_KEY = "cvad:bgVideoPlayheadSeconds:v1";
const VIDEO_WARM_KEY = "cvad:bgVideoWarm:v1";
const VIDEO_READY_EVENT = "cvad:bgVideoReady";
const VIDEO_DISABLED_EVENT = "cvad:bgVideoDisabled";
const VIDEO_ERROR_EVENT = "cvad:bgVideoError";

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
  if (typeof window === "undefined") return "p1080";

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReducedMotion) return "off";

  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (connection?.saveData) return "off";

  const effectiveType = connection?.effectiveType ?? "";
  if (effectiveType === "slow-2g" || effectiveType === "2g") return "off";

  // Default: Android tends to struggle more with 1080p60.
  const ua = navigator.userAgent ?? "";
  const isAndroid = /Android/i.test(ua);
  if (isAndroid) return "p540";

  return "p1080";
}

type AdaptiveBackgroundVideoProps = {
  className?: string;
};

export default function AdaptiveBackgroundVideo({ className = "" }: AdaptiveBackgroundVideoProps) {
  const [tier, setTier] = useState<VideoTier>(() => getVideoTier());
  const [shouldLoad, setShouldLoad] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const warmed = window.sessionStorage.getItem(VIDEO_WARM_KEY) === "1";
      return !warmed;
    } catch {
      return true;
    }
  });
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
    if (typeof window === "undefined") return;

    if (tier === "off") {
      window.dispatchEvent(new CustomEvent(VIDEO_DISABLED_EVENT));
    }
  }, [tier]);

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

  // Determine if user is on Android (mobile) vs PC/iOS
  const isAndroid = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Android/i.test(navigator.userAgent ?? "");
  }, []);

  const src = useMemo(() => {
    if (tier === "off") return null;
    // Android uses optimized H.264 mobile video; PC and iOS use full quality
    return isAndroid ? "/backgroundp_4.mp4" : "/background.mp4";
  }, [tier, isAndroid]);

  const sourceType = "video/mp4";

  // Android video is 9:20 ratio, screens vary (9:16 to 9:19). We need extra width to cover.
  // 9:20 = 0.45 aspect, 9:16 = 0.5625 aspect. Video is narrower, so we scale width up.
  // Using min-w to ensure the video always covers the viewport width.
  const videoClassName = useMemo(() => {
    const baseClasses = "media-guard pointer-events-none absolute inset-0 object-cover object-center opacity-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none data-[ready=true]:opacity-100";
    if (isAndroid) {
      // For 9:20 video on ~9:16 screens: scale width to fill, crop top/bottom
      return `${baseClasses} h-full w-auto min-w-full left-1/2 -translate-x-1/2 ${className}`.trim();
    }
    // Desktop/iOS: standard cover behavior with slight overflow for edge anti-aliasing
    return `${baseClasses} h-[101%] w-[101%] -translate-x-[0.5%] -translate-y-[0.5%] ${className}`.trim();
  }, [isAndroid, className]);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    if (tier === "off") return;
    if (!shouldLoad) return;
    if (isAndroid) return;

    const mc = (navigator as Navigator & {
      mediaCapabilities?: {
        decodingInfo?: (config: unknown) => Promise<{ supported: boolean; smooth?: boolean; powerEfficient?: boolean }>;
      };
    }).mediaCapabilities;

    // If MediaCapabilities isn't available, keep the UA-based default.
    if (!mc?.decodingInfo) return;

    let cancelled = false;

    const probe = async (width: number, height: number, bitrate: number) => {
      try {
        const result = await mc.decodingInfo({
          type: "file",
          video: {
            contentType: 'video/mp4; codecs="avc1.42E01E"',
            width,
            height,
            bitrate,
            framerate: 60,
          },
        });
        return result;
      } catch {
        return null;
      }
    };

    const pickTier = async () => {
      // Prefer power efficient + supported. Smoothness hint isn't always provided.
      const r1080 = await probe(1920, 1080, 4_500_000);
      if (!cancelled && r1080?.supported && r1080.powerEfficient) {
        setTier("p1080");
        return;
      }

      const r720 = await probe(1280, 720, 2_500_000);
      if (!cancelled && r720?.supported) {
        setTier("p720");
        return;
      }

      const r540 = await probe(960, 540, 1_600_000);
      if (!cancelled && r540?.supported) {
        setTier("p540");
        return;
      }

      if (!cancelled) {
        setTier("off");
      }
    };

    void pickTier();

    return () => {
      cancelled = true;
    };
  }, [shouldLoad, tier, isAndroid]);

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

      try {
        window.sessionStorage.setItem(VIDEO_WARM_KEY, "1");
      } catch {
        // ignore
      }

      window.dispatchEvent(new CustomEvent(VIDEO_READY_EVENT));
    };

    const handleError = () => {
      window.dispatchEvent(new CustomEvent(VIDEO_ERROR_EVENT));
    };

    video.addEventListener("timeupdate", persistPlayhead);
    video.addEventListener("pause", persistPlayhead);
    video.addEventListener("loadedmetadata", restoreAndPlay);
    video.addEventListener("canplay", markVisible, { once: true });
    video.addEventListener("playing", markVisible, { once: true });
    video.addEventListener("error", handleError);
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
      video.removeEventListener("error", handleError);
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
      className={videoClassName}
      autoPlay
      loop
      muted
      playsInline
      preload={shouldLoad ? (isAndroid ? "auto" : "metadata") : "none"}
      aria-hidden="true"
      controls={false}
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      disableRemotePlayback
      draggable={false}
      tabIndex={-1}
      onContextMenu={(event) => event.preventDefault()}
    >
      {shouldLoad && src && sourceType ? <source src={src} type={sourceType} /> : null}
    </video>
  );
}
