"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLandingStore } from "@/stores/landing-store";
import { isWaitlistMode } from "@/lib/config";
import {
  heroHeadline,
  heroSubheadline,
  heroCTA,
  heroMockup,
} from "@/lib/animations";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const { t } = useTranslation();
  const { openWaitlistModal } = useLandingStore();

  const handlePrimaryCTA = () => {
    if (isWaitlistMode) {
      openWaitlistModal();
    } else {
      // Redirect to login - will be implemented later
      window.location.href = "/login";
    }
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Copy section */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.h1
              variants={heroHeadline}
              initial="hidden"
              animate="visible"
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight"
            >
              {t("hero.headline")}
            </motion.h1>

            <motion.p
              variants={heroSubheadline}
              initial="hidden"
              animate="visible"
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
            >
              {t("hero.subheadline")}
            </motion.p>

            <motion.div
              variants={heroCTA}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={handlePrimaryCTA}
                className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isWaitlistMode
                  ? t("hero.cta_primary_waitlist")
                  : t("hero.cta_primary_live")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToHowItWorks}
                className="h-14 px-8 text-lg font-medium rounded-full"
              >
                {t("hero.cta_secondary")}
              </Button>
            </motion.div>
          </div>

          {/* Visual section - Phone mockup */}
          <motion.div
            variants={heroMockup}
            initial="hidden"
            animate="visible"
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="relative w-[280px] sm:w-[320px] aspect-[9/16] bg-gradient-to-br from-card to-secondary/20 rounded-[2.5rem] shadow-2xl border-8 border-foreground/10 overflow-hidden">
                {/* Phone notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-foreground/10 rounded-full" />
                
                {/* Placeholder content - Wedding invitation preview */}
                <div className="absolute inset-4 top-10 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">💍</span>
                  </div>
                  <p className="font-display text-sm text-muted-foreground mb-2">
                    You&apos;re Invited
                  </p>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Sarah & Ahmad
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2">
                    15 March 2026
                  </p>
                  <div className="mt-6 w-full space-y-2">
                    <div className="h-8 bg-primary/10 rounded-lg animate-pulse" />
                    <div className="h-8 bg-accent/10 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-20 bg-card rounded-xl shadow-lg p-3 border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  <span className="text-sm font-medium">RSVP: 150</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-4 bottom-32 bg-card rounded-xl shadow-lg p-3 border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  <span className="text-sm font-medium">New wish!</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-8 bottom-20 bg-card rounded-xl shadow-lg p-3 border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎁</span>
                  <span className="text-sm font-medium">Gift claimed</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-muted-foreground cursor-pointer"
          onClick={() => document.getElementById("social-proof")?.scrollIntoView({ behavior: "smooth" })}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
