/**
 * PostHog Analytics Configuration
 * Client-side analytics tracking for the landing page
 */

import posthog from "posthog-js";

export const initPostHog = () => {
  if (typeof window !== "undefined") {
    // Check if PostHog is already initialized
    if (!posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: "/ingest", // Use reverse proxy
        person_profiles: "identified_only",
        capture_pageview: false, // We'll manually track pageviews
        capture_pageleave: true, // Track when users leave pages
        defaults: "2025-11-30",
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") {
            posthog.debug(); // Enable debug mode in development
          }
        },
      });
    }
  }
};

// Helper to get device type
export const getDeviceType = (): string => {
  if (typeof window === "undefined") return "unknown";

  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

// Helper to get referrer
export const getReferrer = (): string => {
  if (typeof document === "undefined") return "";
  return document.referrer || "direct";
};

// Export posthog instance
export { posthog };
