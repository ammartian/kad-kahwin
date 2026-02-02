import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { trackSectionViewed } from "@/lib/posthog-events";

/**
 * Custom hook to track when a section comes into view
 * @param sectionName - Name of the section to track
 */
export function useSectionTracking(sectionName: string) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const hasTracked = useRef(false);

  useEffect(() => {
    if (isInView && !hasTracked.current) {
      const scrollDepth =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      trackSectionViewed({
        section_name: sectionName,
        scroll_depth: Math.round(scrollDepth),
      });

      hasTracked.current = true;
    }
  }, [isInView, sectionName]);

  return { sectionRef, isInView };
}
