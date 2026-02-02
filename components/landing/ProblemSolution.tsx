"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { slideUp, staggerContainer } from "@/lib/animations";
import { AlertTriangle, Sparkles, Heart } from "lucide-react";
import { useSectionTracking } from "@/hooks/use-section-tracking";

export function ProblemSolution() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("problem_solution");

  const columns = [
    {
      icon: AlertTriangle,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
      title: t("problem_solution.problem.title"),
      description: t("problem_solution.problem.description"),
    },
    {
      icon: Sparkles,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      title: t("problem_solution.solution.title"),
      description: t("problem_solution.solution.description"),
    },
    {
      icon: Heart,
      iconColor: "text-accent",
      bgColor: "bg-accent/10",
      title: t("problem_solution.hook.title"),
      description: t("problem_solution.hook.description"),
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
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${column.bgColor} mb-6`}
              >
                <column.icon className={`w-8 h-8 ${column.iconColor}`} />
              </motion.div>

              {/* Title */}
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {column.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-lg leading-relaxed">
                {column.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
