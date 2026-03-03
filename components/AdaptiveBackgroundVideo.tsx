"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

/** Interval (ms) for the watchdog that ensures the video never stays paused. */
const WATCHDOG_INTERVAL_MS = 1_500;
/** Maximum consecutive play-retries before giving up for a cycle. */
const MAX_PLAY_RETRIES = 5;
/** Delay between retry attempts (ms). */
const PLAY_RETRY_DELAY_MS = 350;

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
  // Important: keep the initial render identical on server + client to avoid hydration mismatches.
  const [tier, setTier] = useState<VideoTier>("p1080");
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const tierTimeoutId = window.setTimeout(() => setTier(getVideoTier()), 0);

    let warmed = false;
    try {
      warmed = window.sessionStorage.getItem(VIDEO_WARM_KEY) === "1";
    } catch {
      // ignore
    }

    // Warmed sessions can start loading immediately.
    if (warmed) {
      const warmTimeoutId = window.setTimeout(() => setShouldLoad(true), 0);
      return () => {
        window.clearTimeout(tierTimeoutId);
        window.clearTimeout(warmTimeoutId);
      };
    }

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

  /**
   * Robust play helper – retries with exponential-ish back-off so transient
   * browser blocks (iOS low-power, tab-switch debounce, etc.) are overcome.
   */
  const retryCountRef = useRef<number>(0);

  const ensurePlaying = useCallback(() => {
    const video = videoRef.current;
    if (!video || document.hidden) return;
    if (!video.paused) {
      retryCountRef.current = 0;
      return;
    }

    if (retryCountRef.current >= MAX_PLAY_RETRIES) return;
    retryCountRef.current += 1;

    const attempt = () => {
      if (!videoRef.current || document.hidden) return;
      videoRef.current.play().catch(() => {
        // Schedule another retry after a short delay
        if (retryCountRef.current < MAX_PLAY_RETRIES) {
          window.setTimeout(() => ensurePlaying(), PLAY_RETRY_DELAY_MS);
        }
      });
    };

    attempt();
  }, []);

  // ---- Visibility change: pause when hidden, aggressively resume when visible ----
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        return;
      }

      // Reset retry counter on every visibility restore so we get fresh attempts.
      retryCountRef.current = 0;
      ensurePlaying();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [shouldLoad, tier, ensurePlaying]);

  // ---- Watchdog: periodically verify the video is still playing ----
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || tier === "off") return;

    const watchdogId = window.setInterval(() => {
      if (document.hidden) return; // Don't fight the browser when tab is hidden
      if (video.paused && video.readyState >= 2) {
        retryCountRef.current = 0; // fresh cycle
        ensurePlaying();
      }
    }, WATCHDOG_INTERVAL_MS);

    return () => window.clearInterval(watchdogId);
  }, [shouldLoad, tier, ensurePlaying]);

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

      retryCountRef.current = 0;
      ensurePlaying();
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

    /**
     * Auto-resume on unexpected pause — if the page is visible and the video
     * pauses for any reason (iOS power management, browser throttle, etc.),
     * try to restart it immediately.
     */
    const handleUnexpectedPause = () => {
      if (document.hidden) return; // Intentional pause
      retryCountRef.current = 0;
      // Small delay to avoid fighting the browser during intentional pauses
      window.setTimeout(() => ensurePlaying(), 100);
    };

    /**
     * Handle stalled / waiting — the video is trying to play but ran out of
     * data. Once enough data arrives (`canplaythrough`) it should auto-resume,
     * but we add a safety net.
     */
    const handleStalled = () => {
      if (document.hidden) return;
      // Give the browser a moment to buffer, then nudge
      window.setTimeout(() => {
        if (videoRef.current?.paused && !document.hidden) {
          retryCountRef.current = 0;
          ensurePlaying();
        }
      }, 800);
    };

    /**
     * Safety net for `ended` — should never fire with `loop`, but some
     * browsers/edge-cases may not honour the loop attribute.
     */
    const handleEnded = () => {
      try {
        video.currentTime = 0;
      } catch {
        // ignore
      }
      retryCountRef.current = 0;
      ensurePlaying();
    };

    video.addEventListener("timeupdate", persistPlayhead);
    video.addEventListener("pause", persistPlayhead);
    video.addEventListener("pause", handleUnexpectedPause);
    video.addEventListener("loadedmetadata", restoreAndPlay);
    video.addEventListener("canplay", markVisible, { once: true });
    video.addEventListener("playing", markVisible, { once: true });
    video.addEventListener("error", handleError);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("waiting", handleStalled);
    video.addEventListener("ended", handleEnded);
    window.addEventListener("pagehide", persistPlayhead);

    // Also try to resume on focus (iOS Safari sometimes needs this)
    const handleFocus = () => {
      if (video.paused && !document.hidden) {
        retryCountRef.current = 0;
        ensurePlaying();
      }
    };
    window.addEventListener("focus", handleFocus);

    if (video.readyState >= 1) {
      restoreAndPlay();
    }

    return () => {
      video.removeEventListener("timeupdate", persistPlayhead);
      video.removeEventListener("pause", persistPlayhead);
      video.removeEventListener("pause", handleUnexpectedPause);
      video.removeEventListener("loadedmetadata", restoreAndPlay);
      video.removeEventListener("canplay", markVisible);
      video.removeEventListener("playing", markVisible);
      video.removeEventListener("error", handleError);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("waiting", handleStalled);
      video.removeEventListener("ended", handleEnded);
      window.removeEventListener("pagehide", persistPlayhead);
      window.removeEventListener("focus", handleFocus);
    };
  }, [shouldLoad, src, ensurePlaying]);

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
