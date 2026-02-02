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
    // Track CTA click
    trackHeroCTAClicked({
      button_text: isWaitlistMode
        ? t("hero.cta_primary_waitlist")
        : t("secondary_cta.cta"),
      section: "hero",
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
      ref={sectionRef}
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-primary/10">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, var(--primary) 0%, transparent 50%)",
            backgroundSize: "100% 100%",
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-1/2 right-1/4 w-16 h-16 bg-chart-4/10 rounded-full blur-lg"
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Headline with typewriter-like reveal */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            {t("secondary_cta.headline")}
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10"
          >
            {t("secondary_cta.subheadline")}
          </motion.p>

          {/* CTA Button with elastic animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          >
            <Button
              size="lg"
              onClick={handleCTA}
              className="h-16 px-10 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {t("secondary_cta.cta")}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
