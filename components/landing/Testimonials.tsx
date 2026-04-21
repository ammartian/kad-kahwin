"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { slideUp, staggerContainer } from "@/lib/animations";
import { useSectionTracking } from "@/hooks/use-section-tracking";

const testimonialKeys = ["t1", "t2", "t3"] as const;

export function Testimonials() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("testimonials");

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-1.5 text-primary font-display font-semibold text-[0.72rem] tracking-[0.1em] uppercase mb-3.5">
            {t("testimonials.section_label")}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] tracking-[-0.025em] leading-[1.2] text-foreground">
            {t("testimonials.section_title").split(" ").slice(0, -2).join(" ")}{" "}
            <em className="not-italic text-primary">
              {t("testimonials.section_title").split(" ").slice(-2).join(" ")}
            </em>
          </h2>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[900px] mx-auto"
        >
          {testimonialKeys.map((key, index) => (
            <motion.div
              key={index}
              variants={slideUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-7 border border-primary/[0.12] transition-all duration-300"
            >
              {/* Stars */}
              <div className="text-primary text-[0.9rem] mb-3">★★★★★</div>

              {/* Quote */}
              <p className="text-[0.92rem] text-foreground leading-[1.7] mb-4 italic">
                &ldquo;{t(`testimonials.${key}.quote`)}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[1rem] flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #f3c2df, #E0C6C8)",
                  }}
                >
                  {t(`testimonials.${key}.avatar`)}
                </div>
                <div>
                  <div className="font-display font-bold text-[0.85rem] text-foreground">
                    {t(`testimonials.${key}.name`)}
                  </div>
                  <div className="text-[0.75rem] text-muted-foreground">
                    {t(`testimonials.${key}.meta`)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
