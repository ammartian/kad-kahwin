"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { slideUp, staggerContainer, fadeIn } from "@/lib/animations";
import { UserPlus, FileEdit, Share2 } from "lucide-react";

export function HowItWorks() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: t("how_it_works.step1.title"),
      description: t("how_it_works.step1.description"),
    },
    {
      number: "02",
      icon: FileEdit,
      title: t("how_it_works.step2.title"),
      description: t("how_it_works.step2.description"),
    },
    {
      number: "03",
      icon: Share2,
      title: t("how_it_works.step3.title"),
      description: t("how_it_works.step3.description"),
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 lg:py-28 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {t("how_it_works.section_title")}
          </h2>
        </motion.div>

        {/* Steps timeline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Desktop timeline line */}
          {/* <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" /> */}

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                className="relative text-center"
              >
                {/* Step number badge */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white font-display text-xl font-bold mb-6 shadow-lg"
                >
                  {step.number}
                </motion.div>

                {/* Icon */}
                {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div> */}

                {/* Title */}
                <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>

                {/* Mobile connector line */}
                {/* {index < steps.length - 1 && (
                  <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-16 w-0.5 h-8 bg-gradient-to-b from-primary to-accent" />
                )} */}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Demo video placeholder */}
        {/* <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 lg:mt-20"
        >
          <div className="relative max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-secondary/30 shadow-xl border">
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg"
                >
                  <svg
                    className="w-6 h-6 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>
              </div>
              <p className="text-muted-foreground font-medium">
                Demo video coming soon
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                See the complete flow in 60 seconds
              </p>
            </div>

            
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-chart-4/50" />
              <div className="w-3 h-3 rounded-full bg-chart-3/50" />
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
