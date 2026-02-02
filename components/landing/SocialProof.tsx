"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { useSectionTracking } from "@/hooks/use-section-tracking";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ end, suffix = "", duration = 2 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function SocialProof() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("social_proof");

  const stats = [
    {
      value: 100,
      suffix: "+",
      label: t("social_proof.couples_registered"),
    },
    // {
    //   value: 5000,
    //   suffix: "+",
    //   label: t("social_proof.guests_rsvp"),
    // },
  ];

  const avatarStack = [
    {
      initials: "AH",
    },
    {
      initials: "MAQ",
    },
    {
      initials: "NSI",
    },
    {
      initials: "DE",
    },
    {
      initials: "QM",
    },
    {
      initials: "ES",
    },
  ];

  return (
    <section
      id="social-proof"
      ref={sectionRef}
      className="py-16 bg-muted/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center"
        >
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="text-center"
              >
                <div className="font-display text-4xl sm:text-5xl font-bold text-primary">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-2 text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Trust text */}
          <motion.p
            variants={fadeIn}
            className="text-muted-foreground text-center"
          >
            {t("social_proof.trust_text")}
          </motion.p>

          {/* Avatar stack placeholder */}
          <motion.div
            variants={fadeIn}
            className="mt-6 flex -space-x-3"
          >
            {avatarStack.map((avatar, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-background flex items-center justify-center"
              >
                <span className="text-xs">{avatar.initials}</span>
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
              <span className="text-xs font-medium text-primary">+95</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
