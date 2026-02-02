"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { staggerContainer, slideUp } from "@/lib/animations";
import { trackFAQOpened } from "@/lib/posthog-events";
import { useSectionTracking } from "@/hooks/use-section-tracking";

export function FAQ() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("faq");

  const handleFAQOpen = (index: number, question: string) => {
    trackFAQOpened({
      question_number: index + 1,
      question_text: question,
    });
  };

  const faqs = [
    {
      question: t("faq.q1.question"),
      answer: t("faq.q1.answer"),
    },
    {
      question: t("faq.q2.question"),
      answer: t("faq.q2.answer"),
    },
    {
      question: t("faq.q3.question"),
      answer: t("faq.q3.answer"),
    },
    {
      question: t("faq.q4.question"),
      answer: t("faq.q4.answer"),
    },
    {
      question: t("faq.q5.question"),
      answer: t("faq.q5.answer"),
    },
    {
      question: t("faq.q6.question"),
      answer: t("faq.q6.answer"),
    },
    {
      question: t("faq.q7.question"),
      answer: t("faq.q7.answer"),
    },
    {
      question: t("faq.q8.question"),
      answer: t("faq.q8.answer"),
    },
  ];

  // Split FAQs into two columns for desktop
  const leftColumn = faqs.slice(0, 4);
  const rightColumn = faqs.slice(4);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {t("faq.section_title")}
          </h2>
        </motion.div>

        {/* FAQ accordion - two columns on desktop */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
        >
          {/* Left column */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="space-y-4">
              {leftColumn.map((faq, index) => (
                <motion.div key={index} variants={slideUp}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card rounded-xl px-6 overflow-hidden data-[state=open]:border-primary/30 transition-colors"
                  >
                    <AccordionTrigger
                      className="text-left font-display font-semibold text-foreground hover:text-primary py-5 [&[data-state=open]]:text-primary"
                      onClick={() => handleFAQOpen(index, faq.question)}
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="space-y-4">
              {rightColumn.map((faq, index) => (
                <motion.div key={index + 4} variants={slideUp}>
                  <AccordionItem
                    value={`item-${index + 4}`}
                    className="bg-card rounded-xl px-6 overflow-hidden data-[state=open]:border-primary/30 transition-colors"
                  >
                    <AccordionTrigger
                      className="text-left font-display font-semibold text-foreground hover:text-primary py-5 [&[data-state=open]]:text-primary"
                      onClick={() => handleFAQOpen(index + 4, faq.question)}
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
