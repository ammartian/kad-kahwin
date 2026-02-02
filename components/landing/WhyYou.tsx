"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { slideUp, staggerContainer, fadeIn } from "@/lib/animations";
import { Check, X, Clock, DollarSign, Leaf, TrendingUp, RefreshCw, BarChart3 } from "lucide-react";
import { useSectionTracking } from "@/hooks/use-section-tracking";

export function WhyYou() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("why_you");

  const comparisonRows = [
    {
      feature: t("why_you.comparison.cost"),
      traditional: t("why_you.comparison.cost_traditional"),
      digital: t("why_you.comparison.cost_digital"),
      traditionalBad: true,
    },
    {
      feature: t("why_you.comparison.time"),
      traditional: t("why_you.comparison.time_traditional"),
      digital: t("why_you.comparison.time_digital"),
      traditionalBad: true,
    },
    {
      feature: t("why_you.comparison.updates"),
      traditional: t("why_you.comparison.updates_traditional"),
      digital: t("why_you.comparison.updates_digital"),
      traditionalBad: true,
    },
    {
      feature: t("why_you.comparison.rsvp_tracking"),
      traditional: t("why_you.comparison.rsvp_traditional"),
      digital: t("why_you.comparison.rsvp_digital"),
      traditionalBad: true,
    },
    {
      feature: t("why_you.comparison.eco"),
      traditional: t("why_you.comparison.eco_traditional"),
      digital: t("why_you.comparison.eco_digital"),
      traditionalBad: true,
      traditionalIcon: false,
      digitalIcon: true,
    },
    {
      feature: t("why_you.comparison.wishlist"),
      traditional: t("why_you.comparison.wishlist_traditional"),
      digital: t("why_you.comparison.wishlist_digital"),
      traditionalBad: true,
      traditionalIcon: false,
      digitalIcon: true,
    },
  ];

  const usps = [
    { icon: Clock, text: t("why_you.usps.save_time") },
    { icon: DollarSign, text: t("why_you.usps.save_money") },
    { icon: Leaf, text: t("why_you.usps.eco_friendly") },
    { icon: TrendingUp, text: t("why_you.usps.earn_income") },
    { icon: RefreshCw, text: t("why_you.usps.real_time") },
    { icon: BarChart3, text: t("why_you.usps.data_driven") },
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
            {t("why_you.section_title")}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Comparison table */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="overflow-hidden rounded-2xl border bg-card shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-4 py-4 text-left font-display font-semibold">
                      {t("why_you.comparison.feature")}
                    </th>
                    <th className="px-4 py-4 text-center font-display font-semibold">
                      {t("why_you.comparison.traditional")}
                    </th>
                    <th className="px-4 py-4 text-center font-display font-semibold">
                      {t("why_you.comparison.digital")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-b last:border-b-0 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/30"
                      }`}
                    >
                      <td className="px-4 py-4 font-medium text-foreground">
                        {row.feature}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {row.traditionalIcon === false ? (
                            <X className="w-5 h-5 text-destructive" />
                          ) : null}
                          <span className="text-muted-foreground text-sm">
                            {row.traditional}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {row.digitalIcon && (
                            <Check className="w-5 h-5 text-chart-3" />
                          )}
                          <span className="text-foreground font-medium text-sm">
                            {row.digital}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* USP bullets */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-4"
          >
            {usps.map((usp, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-chart-3" />
                </div>
                <div className="flex items-center gap-3">
                  <usp.icon className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">{usp.text}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
