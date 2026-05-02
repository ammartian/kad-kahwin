"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLandingStore } from "@/stores/landing-store";
import { isWaitlistMode } from "@/lib/config";
import { fadeIn } from "@/lib/animations";
import { useSectionTracking } from "@/hooks/use-section-tracking";
import { trackHeroCTAClicked } from "@/lib/posthog-events";

export function SecondaryCTA() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("secondary_cta");
  const { openWaitlistModal } = useLandingStore();

  const handleCTA = () => {
    trackHeroCTAClicked({
      button_text: t("secondary_cta.cta"),
      section: "secondary_cta",
      button_type: "secondary",
    });
    if (isWaitlistMode) {
      openWaitlistModal("secondary_cta");
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <section
      id="waitlist"
      ref={sectionRef}
      className="relative py-20 lg:py-28 overflow-hidden text-center"
      style={{ background: "linear-gradient(135deg, var(--primary) 0%, #9b2d78 100%)" }}
    >
      {/* Radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 120%, rgba(255,255,255,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-[580px] mx-auto"
        >
          {/* Section label */}
          <div
            className="inline-flex items-center gap-1.5 font-display font-semibold text-[0.72rem] tracking-[0.1em] uppercase mb-5"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {t("secondary_cta.label")}
          </div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] tracking-[-0.025em] leading-[1.2] text-white"
          >
            {t("secondary_cta.headline")}
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 text-base leading-[1.7] max-w-[500px] mx-auto"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            {t("secondary_cta.subheadline")}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
            className="mt-8"
          >
            <Button
              size="lg"
              onClick={handleCTA}
              className="h-14 px-8 text-base font-bold rounded-full transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: "#fff",
                color: "var(--primary)",
              }}
            >
              {t("secondary_cta.cta")}
            </Button>
          </motion.div>

          {/* Fine print */}
          <p className="mt-3.5 text-[0.75rem]" style={{ color: "rgba(255,255,255,0.5)" }}>
            {t("secondary_cta.fine_print")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
