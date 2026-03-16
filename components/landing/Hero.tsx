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
import { trackHeroCTAClicked } from "@/lib/posthog-events";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const avatarStack = [
  { initials: "AH" },
  { initials: "MAQ" },
  { initials: "NSI" },
  { initials: "DE" },
  { initials: "QM" },
];

export function Hero() {
  const { t } = useTranslation();
  const { openWaitlistModal } = useLandingStore();
  const waitlistCount = useQuery(api.waitlist.getWaitlistCount) ?? 0;
  const displayCount = waitlistCount + 80;

  const handlePrimaryCTA = () => {
    trackHeroCTAClicked({
      button_text: isWaitlistMode
        ? t("hero.cta_primary_waitlist")
        : t("hero.cta_primary_live"),
      section: "hero",
      button_type: "primary",
    });

    if (isWaitlistMode) {
      openWaitlistModal("hero");
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Copy section */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.h1
              variants={heroHeadline}
              initial="hidden"
              animate="visible"
              className="font-landing text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-tight"
            >
              {t("hero.headline")}
            </motion.h1>

            <motion.p
              variants={heroSubheadline}
              initial="hidden"
              animate="visible"
              className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
            >
              {t("hero.subheadline")}
            </motion.p>

            {/* Free for first 50 couples note */}
            <motion.p
              variants={heroSubheadline}
              initial="hidden"
              animate="visible"
              className="mt-3 text-sm font-medium text-primary max-w-xl mx-auto lg:mx-0"
            >
              {t("hero.free_note", { defaultValue: "Free for first 50 couples. Join the waitlist." })}
            </motion.p>

            <motion.div
              variants={heroCTA}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={handlePrimaryCTA}
                className="h-13 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isWaitlistMode
                  ? t("hero.cta_primary_waitlist")
                  : t("hero.cta_primary_live")}
              </Button>
            </motion.div>

            {/* Inline social proof strip */}
            <motion.div
              variants={heroCTA}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              {/* Avatar stack */}
              <div className="flex -space-x-2.5">
                {avatarStack.map((avatar, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/50 border-2 border-background flex items-center justify-center"
                  >
                    <span className="text-[10px] font-semibold text-foreground">{avatar.initials}</span>
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-primary">+{Math.max(0, displayCount - avatarStack.length)}</span>
                </div>
              </div>

              {/* Count + label */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-primary">
                  {displayCount}+
                </span>
                <span className="text-sm text-muted-foreground">
                  {t("social_proof.couples_registered")}
                </span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-2 text-xs text-muted-foreground text-center lg:text-left"
            >
              {t("social_proof.trust_text")}
            </motion.p>
          </div>

          {/* Visual section — Phone mockup */}
          <motion.div
            variants={heroMockup}
            initial="hidden"
            animate="visible"
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="relative w-[260px] sm:w-[300px] aspect-[9/16] bg-gradient-to-br from-card to-secondary/20 rounded-[2.5rem] shadow-2xl border-8 border-foreground overflow-hidden mt-10">
                {/* Phone notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-foreground rounded-full" />

                {/* Invitation preview */}
                <div className="absolute inset-4 top-10 flex flex-col items-center justify-center text-center p-3">
                  <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                    <span className="text-xl">💍</span>
                  </div>
                  <p className="font-landing text-xs text-muted-foreground mb-1">
                    You&apos;re Invited
                  </p>
                  <h3 className="font-landing text-lg text-foreground">
                    Shafiqah & Qayyum
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    15 March 2026
                  </p>
                  <div className="mt-5 w-full space-y-2">
                    <div className="h-7 bg-primary/10 rounded-lg animate-pulse" />
                    <div className="h-7 bg-accent/20 rounded-lg animate-pulse" />
                    <div className="h-7 bg-secondary/10 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Floating chips */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-20 bg-card rounded-xl shadow-lg p-2.5 border border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <span className="text-xs font-semibold">RSVP: 150</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-4 bottom-32 bg-card rounded-xl shadow-lg p-2.5 border border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  <span className="text-xs font-semibold">New wish!</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-8 bottom-20 bg-card rounded-xl shadow-lg p-2.5 border border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎁</span>
                  <span className="text-xs font-semibold">Gift claimed</span>
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
          onClick={() =>
            document
              .getElementById("social-proof")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
