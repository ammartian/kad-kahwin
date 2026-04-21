"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLandingStore } from "@/stores/landing-store";
import { isWaitlistMode } from "@/lib/config";
import { scaleIn } from "@/lib/animations";
import { trackPricingCTAClicked } from "@/lib/posthog-events";
import { useSectionTracking } from "@/hooks/use-section-tracking";

export function Pricing() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("pricing");
  const { openWaitlistModal } = useLandingStore();

  const handleCTA = () => {
    trackPricingCTAClicked();
    if (isWaitlistMode) {
      openWaitlistModal("secondary_cta");
    } else {
      window.location.href = "/login";
    }
  };

  const features = [
    t("pricing.features.custom_url"),
    t("pricing.features.themes"),
    t("pricing.features.rsvp"),
    t("pricing.features.wishes"),
    t("pricing.features.wishlist"),
    t("pricing.features.excel"),
    t("pricing.features.donation"),
    t("pricing.features.language"),
    t("pricing.features.support"),
  ];

  return (
    <section id="pricing" ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[780px] mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-1.5 text-primary font-display font-semibold text-[0.72rem] tracking-[0.1em] uppercase mb-3.5">
              {t("pricing.section_label")}
            </span>
            <h2 className="font-display font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] tracking-[-0.025em] leading-[1.2] text-foreground">
              {t("pricing.headline").split(", ")[0]},{" "}
              <em className="not-italic text-primary">{t("pricing.headline").split(", ")[1]}</em>
            </h2>
            <p className="mt-3 text-muted-foreground mx-auto leading-[1.7]">
              {t("pricing.section_sub")}
            </p>
          </motion.div>

          {/* Pricing card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="max-w-[460px] mx-auto"
          >
            <div
              className="relative bg-background rounded-3xl p-7 sm:p-8 text-center overflow-hidden"
              style={{ border: "2px solid var(--primary)" }}
            >
              {/* Badge */}
              <div className="absolute top-5 right-5">
                <span
                  className="text-white font-display font-bold text-[0.7rem] px-3 py-1 rounded-full uppercase tracking-[0.04em]"
                  style={{ background: "var(--primary)" }}
                >
                  {t("pricing.badge")}
                </span>
              </div>

              {/* Decorative circle */}
              <div
                className="absolute bottom-0 right-0 w-[200px] h-[200px] rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(197,47,142,0.08) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10">
                {/* Price info */}
                <div className="mt-8 sm:mt-4 mb-6">
                  <div className="text-muted-foreground font-display font-bold text-sm mb-2">
                    {t("pricing.title")}
                  </div>
                  <div
                    className="font-display font-extrabold text-foreground leading-none"
                    style={{ fontSize: "2.2rem", letterSpacing: "-0.03em" }}
                  >
                    <sup className="text-[1.2rem] align-super">RM</sup>
                    {t("pricing.price_rm")}
                  </div>
                  <div className="text-[0.8rem] text-muted-foreground mt-1">
                    {t("pricing.note")}
                  </div>
                  <div className="mt-5">
                    <Button
                      size="lg"
                      onClick={handleCTA}
                      className="rounded-full font-semibold px-7 text-[0.88rem]"
                    >
                      {isWaitlistMode ? t("pricing.cta") : t("pricing.cta")}
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

                {/* Features list */}
                <ul className="space-y-1.5 text-left">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2.5 text-[0.83rem] text-muted-foreground"
                    >
                      <span className="text-primary font-extrabold text-[0.9rem] flex-shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Promo note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center text-[0.82rem] text-muted-foreground mt-5"
          >
            🎉 {t("pricing.promo")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
