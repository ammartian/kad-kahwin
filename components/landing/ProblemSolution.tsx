"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { slideUp, staggerContainer } from "@/lib/animations";
import { useSectionTracking } from "@/hooks/use-section-tracking";

export function ProblemSolution() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("problem_solution");

  const columns = [
    {
      badge: t("problem_solution.problem.badge", { defaultValue: "Traditional Wedding Card?" }),
      title: t("problem_solution.problem.title"),
      description: t("problem_solution.problem.description"),
      badgeClass: "bg-destructive/10 text-destructive",
    },
    {
      badge: t("problem_solution.solution.badge", { defaultValue: "Digital Cards?" }),
      title: t("problem_solution.solution.title"),
      description: t("problem_solution.solution.description"),
      badgeClass: "bg-primary/10 text-primary",
    },
    {
      badge: t("problem_solution.hook.badge", { defaultValue: "A Wedding to Remember" }),
      title: t("problem_solution.hook.title"),
      description: t("problem_solution.hook.description"),
      badgeClass: "bg-accent/40 text-accent-foreground",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {columns.map((column, index) => (
            <motion.div
              key={index}
              variants={slideUp}
              className="text-center md:text-left"
            >
              {/* Badge label */}
              <span
                className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4 ${column.badgeClass}`}
              >
                {column.badge}
              </span>

              {/* Title */}
              <h3 className="font-landing text-2xl lg:text-3xl text-foreground mb-4">
                {column.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-base leading-relaxed">
                {column.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
