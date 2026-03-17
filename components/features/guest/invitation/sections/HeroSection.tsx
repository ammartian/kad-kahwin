"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  coupleName: string;
  displayDate: string;
  displayTime: string;
  backgroundImageUrl?: string | null;
  backgroundColor: string;
  colorPrimary: string;
  colorAccent: string;
}

export function HeroSection({
  coupleName,
  displayDate,
  displayTime,
  backgroundImageUrl,
  backgroundColor,
  colorPrimary,
  colorAccent,
}: HeroSectionProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Background image with Ken Burns */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={shouldReduceMotion ? {} : { scale: [1, 1.1] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          >
            <Image
              src={backgroundImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="390px"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        {/* Decorative top element */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-6 text-2xl"
          style={{ color: colorAccent }}
          aria-hidden="true"
        >
          ✦ ✦ ✦
        </motion.div>

        {/* Couple names */}
        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mb-4 text-4xl font-bold leading-tight tracking-wide"
          style={{
            color: backgroundImageUrl ? "#ffffff" : colorPrimary,
            fontFamily: "'Playfair Display', serif",
            textShadow: backgroundImageUrl ? "0 2px 8px rgba(0,0,0,0.4)" : "none",
          }}
        >
          {coupleName}
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-4 h-px w-24"
          style={{ backgroundColor: colorAccent }}
        />

        {/* Date */}
        {displayDate && (
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-lg font-medium tracking-widest uppercase"
            style={{
              color: backgroundImageUrl ? "rgba(255,255,255,0.9)" : colorAccent,
            }}
          >
            {displayDate}
          </motion.p>
        )}

        {/* Time */}
        {displayTime && (
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-1 text-base"
            style={{
              color: backgroundImageUrl ? "rgba(255,255,255,0.8)" : colorAccent,
            }}
          >
            {displayTime}
          </motion.p>
        )}

        {/* Decorative bottom element */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-6 text-sm tracking-widest uppercase"
          style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.7)" : colorAccent }}
        >
          Walimatul Urus
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2"
        animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        aria-label={t("guest.scroll_down")}
      >
        <ChevronDown
          className="h-6 w-6"
          style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.7)" : colorAccent }}
        />
      </motion.div>
    </section>
  );
}
