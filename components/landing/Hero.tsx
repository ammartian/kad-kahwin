"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLandingStore } from "@/stores/landing-store";
import { isWaitlistMode } from "@/lib/config";
import { trackHeroCTAClicked } from "@/lib/posthog-events";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function AnimatedCounter({ end, ready, suffix = "" }: { end: number; ready: boolean; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ready) return;
    let startTime: number;
    let raf: number;
    const target = end;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 2000, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref}>{count}{suffix}</span>;
}

const avatarStack = [
  { initials: "AH" },
  { initials: "MAQ" },
  { initials: "NSI" },
  { initials: "DE" },
  { initials: "QM" },
  { initials: "ES" },
];

export function Hero() {
  const { t } = useTranslation();
  const { openWaitlistModal } = useLandingStore();
  const waitlistCount = useQuery(api.waitlist.getWaitlistCount);
  const displayCount = (waitlistCount ?? 0) + 80;
  const isCountReady = waitlistCount !== undefined;

  const handlePrimaryCTA = () => {
    trackHeroCTAClicked({
      button_text: isWaitlistMode ? t("hero.cta_primary_waitlist") : t("hero.cta_primary_live"),
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
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-background px-[6vw] pt-[120px] pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, #f9d8ee 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, #e0c6c8 0%, transparent 60%)",
          }}
        />
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[380px] h-[380px] rounded-full opacity-35 blur-[60px] -top-20 -left-24"
          style={{ background: "#f3b8d9" }}
        />
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[280px] h-[280px] rounded-full opacity-35 blur-[60px] top-[40%] -right-16"
          style={{ background: "#d4b8e0" }}
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[200px] h-[200px] rounded-full opacity-35 blur-[60px] bottom-[5%] left-[15%]"
          style={{ background: "#fcd5e8" }}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-[680px]">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 bg-primary/[0.08] border border-primary/[0.18] text-primary font-display font-semibold text-[0.75rem] tracking-[0.04em] uppercase px-3.5 py-1.5 rounded-full mb-6"
        >
          <span className="text-[0.6rem]">✦</span>
          {t("hero.badge")}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-extrabold text-[clamp(2.4rem,5.5vw,3.8rem)] leading-[1.15] tracking-[-0.03em] text-foreground"
        >
          {t("hero.headline_1")}
          <br />
          {t("hero.headline_2")}{" "}
          <em
            className="not-italic"
            style={{
              background: "linear-gradient(135deg, var(--primary) 0%, #e05aab 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("hero.headline_em")}
          </em>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-[1.05rem] text-muted-foreground max-w-[500px] mx-auto leading-[1.7]"
        >
          {t("hero.subheadline")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex items-center justify-center gap-3 flex-wrap"
        >
          <Button
            size="lg"
            onClick={handlePrimaryCTA}
            className="h-[50px] px-8 text-[0.95rem] font-bold rounded-full transition-all duration-200"
            style={{ boxShadow: "0 8px 24px rgba(197,47,142,0.3)" }}
          >
            {isWaitlistMode ? t("hero.cta_primary_waitlist") : t("hero.cta_primary_live")}
          </Button>
          <a
            href="#features"
            className="inline-flex items-center gap-1 text-muted-foreground font-display font-semibold text-[0.9rem] px-5 py-3 rounded-full hover:text-primary transition-colors duration-200"
          >
            {t("hero.cta_ghost")} →
          </a>
        </motion.div>

        {/* Social proof row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-3 flex-wrap"
        >
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {avatarStack.map((avatar, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/40 border-2 border-background flex items-center justify-center"
              >
                <span className="text-[8px] font-semibold text-foreground">{avatar.initials}</span>
              </div>
            ))}
            <div className="w-7 h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
              <span className="text-[8px] font-semibold text-primary">+{displayCount - 6}</span>
            </div>
          </div>

          {/* Count + label */}
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-[0.95rem] text-primary">
              <AnimatedCounter end={displayCount} ready={isCountReady} suffix="+" />
            </span>
            <span className="text-[0.82rem] text-muted-foreground font-medium">
              {t("social_proof.couples_registered")}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Device mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 mt-16"
      >
        <div className="relative inline-block">
          {/* Float card left */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-[90px] top-8 bg-white rounded-2xl px-3.5 py-2.5 z-10 hidden sm:block font-display"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
          >
            <div className="text-lg mb-0.5">💌</div>
            <div className="text-[0.65rem] text-muted-foreground font-semibold whitespace-nowrap">
              Jemputan Dihantar
            </div>
            <div className="text-[1.1rem] font-extrabold text-foreground">1,248</div>
          </motion.div>

          {/* Phone frame */}
          <div
            className="w-[200px] h-[360px] bg-white rounded-[32px] relative overflow-hidden flex items-center justify-center"
            style={{
              border: "8px solid #e8e0f0",
              boxShadow: "0 32px 80px rgba(197,47,142,0.15), 0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="w-full h-full flex flex-col items-center justify-center p-5 gap-2"
              style={{
                background: "linear-gradient(160deg, #fff5fa 0%, #fce8f3 40%, #f0e0f8 100%)",
              }}
            >
              {/* Mock card 1 */}
              <div
                className="rounded-xl p-2.5 w-full"
                style={{ background: "rgba(255,255,255,0.8)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <div className="text-[0.55rem] font-bold text-primary font-display">Ahmad & Aisyah</div>
                <div className="text-[0.45rem] text-muted-foreground mt-0.5">
                  Majlis Perkahwinan • 15 Jun 2025
                </div>
                <div className="h-px my-1.5" style={{ background: "rgba(195,47,142,0.12)" }} />
                <div className="flex items-center gap-1.5 my-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <div className="h-1 rounded bg-muted flex-1" />
                </div>
                <div className="flex items-center gap-1.5 my-0.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#E0C6C8" }}
                  />
                  <div className="h-1 rounded bg-muted w-4/5" />
                </div>
                <span
                  className="inline-block mt-1 px-1.5 py-0.5 rounded-full text-primary text-[0.4rem] font-semibold"
                  style={{ background: "rgba(197,47,142,0.12)" }}
                >
                  RSVP Terbuka ✓
                </span>
              </div>

              {/* Mock card 2 */}
              <div
                className="rounded-xl p-2.5 w-full"
                style={{ background: "rgba(197,47,142,0.06)" }}
              >
                <div
                  className="text-[0.55rem] font-bold font-display"
                  style={{ color: "#8784A1" }}
                >
                  Ucapan Terbaru
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#E0C6C8" }}
                  />
                  <div className="h-1 rounded bg-muted/50 w-[90%]" />
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#E0C6C8" }}
                  />
                  <div className="h-1 rounded bg-muted/50 w-[70%]" />
                </div>
              </div>

              <span
                className="text-[0.45rem] px-2.5 py-1 rounded-full text-primary font-semibold"
                style={{ background: "rgba(197,47,142,0.1)" }}
              >
                kadkahwin.my/Ahmad-Aisyah
              </span>
            </div>
          </div>

          {/* Float card right */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-[90px] bottom-16 bg-white rounded-2xl px-3.5 py-2.5 z-10 hidden sm:block font-display"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
          >
            <div className="text-lg mb-0.5">📊</div>
            <div className="text-[0.65rem] text-muted-foreground font-semibold whitespace-nowrap">
              RSVP Hadir
            </div>
            <div className="text-[1.1rem] font-extrabold text-foreground">87%</div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
