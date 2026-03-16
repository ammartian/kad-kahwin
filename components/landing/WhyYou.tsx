"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { slideUp, staggerContainer } from "@/lib/animations";
import { useSectionTracking } from "@/hooks/use-section-tracking";

export function WhyYou() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("why_you");

  const columns = [
    {
      header: t("why_you.col1.header"),
      items: [
        t("why_you.col1.item1"),
        t("why_you.col1.item2"),
        t("why_you.col1.item3"),
        t("why_you.col1.item4"),
        t("why_you.col1.item5"),
        t("why_you.col1.item6"),
      ],
    },
    {
      header: t("why_you.col2.header"),
      items: [
        t("why_you.col2.item1"),
        t("why_you.col2.item2"),
        t("why_you.col2.item3"),
        t("why_you.col2.item4"),
        t("why_you.col2.item5"),
        t("why_you.col2.item6"),
      ],
    },
    {
      header: t("why_you.col3.header"),
      items: [
        t("why_you.col3.item1"),
        t("why_you.col3.item2"),
        t("why_you.col3.item3"),
        t("why_you.col3.item4"),
        t("why_you.col3.item5"),
        t("why_you.col3.item6"),
      ],
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-landing text-3xl sm:text-4xl lg:text-5xl text-foreground">
            {t("why_you.section_title")}
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 lg:gap-10"
        >
          {columns.map((col, colIndex) => (
            <motion.div
              key={colIndex}
              variants={slideUp}
              className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-sm"
            >
              <h3 className="font-landing text-xl lg:text-2xl text-foreground mb-6 pb-4 border-b border-border">
                {col.header}
              </h3>
              <ul className="space-y-3">
                {col.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                  >
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
