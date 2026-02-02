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
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: CheckCircle,
      title: t("features.rsvp.title"),
      description: t("features.rsvp.description"),
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      icon: MessageCircle,
      title: t("features.wishes.title"),
      description: t("features.wishes.description"),
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      icon: Users,
      title: t("features.multi_manager.title"),
      description: t("features.multi_manager.description"),
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
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
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
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
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-card rounded-2xl p-6 lg:p-8 shadow-sm border hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgColor} mb-4`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </motion.div>

              {/* Title */}
              <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
