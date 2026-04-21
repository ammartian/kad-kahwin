"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { slideUp, staggerContainer } from "@/lib/animations";
import { useSectionTracking } from "@/hooks/use-section-tracking";

const featureList = [
  { emoji: "🔗", titleKey: "features.custom_link.title", descKey: "features.custom_link.description" },
  { emoji: "✏️", titleKey: "features.live_preview.title", descKey: "features.live_preview.description" },
  { emoji: "📊", titleKey: "features.rsvp_analytics.title", descKey: "features.rsvp_analytics.description" },
  { emoji: "💬", titleKey: "features.wishes.title", descKey: "features.wishes.description" },
  { emoji: "🛍️", titleKey: "features.wishlist_store.title", descKey: "features.wishlist_store.description" },
  { emoji: "💸", titleKey: "features.donation.title", descKey: "features.donation.description" },
  { emoji: "📋", titleKey: "features.excel.title", descKey: "features.excel.description" },
  { emoji: "♾️", titleKey: "features.lifetime.title", descKey: "features.lifetime.description" },
];

export function Features() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("features");

  return (
    <section id="features" ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 text-primary font-display font-semibold text-[0.72rem] tracking-[0.1em] uppercase mb-3.5">
            {t("features.section_label")}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] tracking-[-0.025em] leading-[1.2] text-foreground">
            {t("features.section_title").replace(t("features.section_title_em"), "").trim()}{" "}
            <em className="not-italic text-primary">{t("features.section_title_em")}</em>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-[500px] mx-auto leading-[1.7]">
            {t("features.section_sub")}
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1100px] mx-auto"
        >
          {featureList.map((feature, index) => (
            <motion.div
              key={index}
              variants={slideUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-background border border-primary/[0.12] rounded-2xl p-7 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(197,47,142,0.1)] hover:border-primary/30 relative overflow-hidden"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-primary/[0.08] flex items-center justify-center text-[1.3rem] mb-4">
                {feature.emoji}
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-[0.95rem] text-foreground mb-1.5">
                {t(feature.titleKey)}
              </h3>

              {/* Description */}
              <p className="text-[0.88rem] text-muted-foreground leading-[1.6]">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
