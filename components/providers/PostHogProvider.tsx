"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, posthog } from "@/lib/posthog";
import { trackLandingPageViewed, trackScrollDepth } from "@/lib/posthog-events";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollDepthTracked = useRef({
    "25%": false,
    "50%": false,
    "75%": false,
    "100%": false,
  });

  // Initialize PostHog
  useEffect(() => {
    initPostHog();

    // Track landing page viewed on mount
    trackLandingPageViewed();
  }, []);

  // Track pageviews on route change
  useEffect(() => {
    if (pathname) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
      });
    }
  }, [pathname, searchParams]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercentage =
        (scrollTop / (documentHeight - windowHeight)) * 100;

      // Track 25%
      if (scrollPercentage >= 25 && !scrollDepthTracked.current["25%"]) {
        trackScrollDepth("25%");
        scrollDepthTracked.current["25%"] = true;
      }

      // Track 50%
      if (scrollPercentage >= 50 && !scrollDepthTracked.current["50%"]) {
        trackScrollDepth("50%");
        scrollDepthTracked.current["50%"] = true;
      }

      // Track 75%
      if (scrollPercentage >= 75 && !scrollDepthTracked.current["75%"]) {
        trackScrollDepth("75%");
        scrollDepthTracked.current["75%"] = true;
      }

      // Track 100%
      if (scrollPercentage >= 99 && !scrollDepthTracked.current["100%"]) {
        trackScrollDepth("100%");
        scrollDepthTracked.current["100%"] = true;
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, []);

  // Track page leave events
  useEffect(() => {
    const handlePageLeave = () => {
      posthog.capture("$pageleave", null, {
        transport: "sendBeacon",
      });
    };

    // Use pagehide if available for better reliability, otherwise fallback to unload
    const event = "onpagehide" in window ? "pagehide" : "unload";
    window.addEventListener(event, handlePageLeave);

    return () => {
      window.removeEventListener(event, handlePageLeave);
    };
  }, []);

  return <>{children}</>;
}
