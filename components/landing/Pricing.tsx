"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLandingStore } from "@/stores/landing-store";
import { isWaitlistMode, siteConfig } from "@/lib/config";
import { scaleIn, fadeIn } from "@/lib/animations";
import { Check, Sparkles } from "lucide-react";

export function Pricing() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { openWaitlistModal } = useLandingStore();

  const handleCTA = () => {
    if (isWaitlistMode) {
      openWaitlistModal();
    } else {
      window.location.href = "/login";
    }
  };

  const features = [
    t("pricing.features.custom_url"),
    t("pricing.features.live_preview"),
    t("pricing.features.rsvp"),
    t("pricing.features.wishes"),
    t("pricing.features.wishlist"),
    t("pricing.features.multi_manager"),
    t("pricing.features.excel"),
    t("pricing.features.donation"),
    t("pricing.features.language"),
    t("pricing.features.lifetime"),
  ];

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {t("pricing.headline")}
          </h2>
        </motion.div>

        {/* Pricing card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-lg mx-auto"
        >
          <div className="relative bg-card rounded-3xl shadow-xl border-2 border-primary/20 overflow-hidden">
            {/* Early bird badge */}
            {siteConfig.pricing.earlyBirdFree && (
              <motion.div
                initial={{ x: 100, rotate: 45 }}
                animate={isInView ? { x: 0, rotate: 0 } : { x: 100, rotate: 45 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute top-4 right-8"
              >
                <div className="bg-chart-4 text-foreground px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  <span>{t("pricing.early_bird")}</span>
                </div>
              </motion.div>
            )}

            <div className="p-8 lg:p-10">
              {/* Price */}
              <div className="text-center mt-4 mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="font-display text-6xl lg:text-7xl font-bold text-primary mb-2 line-through"
                >
                  {t("pricing.price")}
                </motion.div>
                <p className="text-muted-foreground font-medium">
                  {t("pricing.subtitle")}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("pricing.unlimited")}
                </p>
                {siteConfig.pricing.earlyBirdFree && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("pricing.early_bird_note")}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

              {/* Features list */}
              <motion.ul
                variants={fadeIn}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="space-y-4 mb-8"
              >
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-chart-3/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-chart-3" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTA */}
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Button
                  size="lg"
                  onClick={handleCTA}
                  className="w-full h-14 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  {isWaitlistMode
                    ? t("hero.cta_primary_waitlist")
                    : t("pricing.cta")}
                </Button>
              </motion.div>
            </div>

            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
