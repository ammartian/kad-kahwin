"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { slideUp, staggerContainer } from "@/lib/animations";
import {
  Palette,
  Gift,
  CheckCircle,
  MessageCircle,
  Users,
  Smartphone,
} from "lucide-react";
import { useSectionTracking } from "@/hooks/use-section-tracking";

export function Features() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("features");

  const features = [
    {
      icon: Palette,
      title: t("features.live_preview.title"),
      description: t("features.live_preview.description"),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Gift,
      title: t("features.wishlist.title"),
      description: t("features.wishlist.description"),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CheckCircle,
      title: t("features.rsvp.title"),
      description: t("features.rsvp.description"),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: MessageCircle,
      title: t("features.wishes.title"),
      description: t("features.wishes.description"),
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Users,
      title: t("features.multi_manager.title"),
      description: t("features.multi_manager.description"),
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Smartphone,
      title: t("features.mobile_first.title"),
      description: t("features.mobile_first.description"),
      color: "text-primary",
      bgColor: "bg-primary/10",
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
            {t("features.section_title")}
          </h2>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={slideUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border hover:shadow-md hover:border-primary/40 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${feature.bgColor} mb-4`}
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>

              {/* Title */}
              <h3 className="font-landing text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
