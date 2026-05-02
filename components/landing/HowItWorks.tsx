"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { slideUp, staggerContainer } from "@/lib/animations";
import { useSectionTracking } from "@/hooks/use-section-tracking";

export function HowItWorks() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("how_it_works");

  const steps = [
    {
      number: "1",
      title: t("how_it_works.step1.title"),
      description: t("how_it_works.step1.description"),
    },
    {
      number: "2",
      title: t("how_it_works.step2.title"),
      description: t("how_it_works.step2.description"),
    },
    {
      number: "3",
      title: t("how_it_works.step3.title"),
      description: t("how_it_works.step3.description"),
    },
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[880px] mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-1.5 text-primary font-display font-semibold text-[0.72rem] tracking-[0.1em] uppercase mb-3.5">
              {t("how_it_works.section_label")}
            </span>
            <h2 className="font-display font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] tracking-[-0.025em] leading-[1.2] text-foreground">
              {t("how_it_works.section_title")}
            </h2>
            <p className="mt-3 text-muted-foreground text-center leading-[1.7]">
              {t("how_it_works.section_sub")}
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8 relative"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                className="relative text-center"
              >
                {/* Step number badge */}
                <div
                  className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 font-display font-extrabold text-[1.1rem] text-white"
                  style={{
                    background: "linear-gradient(135deg, var(--primary), #e05aab)",
                    boxShadow: "0 8px 20px rgba(197,47,142,0.3)",
                  }}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-[1rem] text-foreground mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[0.87rem] text-muted-foreground leading-[1.6] max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
