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
    { question: t("faq.q1.question"), answer: t("faq.q1.answer") },
    { question: t("faq.q2.question"), answer: t("faq.q2.answer") },
    { question: t("faq.q3.question"), answer: t("faq.q3.answer") },
    { question: t("faq.q4.question"), answer: t("faq.q4.answer") },
    { question: t("faq.q5.question"), answer: t("faq.q5.answer") },
    { question: t("faq.q6.question"), answer: t("faq.q6.answer") },
    { question: t("faq.q7.question"), answer: t("faq.q7.answer") },
    { question: t("faq.q8.question"), answer: t("faq.q8.answer") },
  ];

  return (
    <section id="faq" ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-1.5 text-primary font-display font-semibold text-[0.72rem] tracking-[0.1em] uppercase mb-3.5">
            {t("faq.section_title")}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] tracking-[-0.025em] leading-[1.2] text-foreground">
            {t("faq.section_heading")} {t("faq.section_heading_em")}
          </h2>
        </motion.div>

        {/* FAQ accordion — single column */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-0">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={slideUp}>
                <AccordionItem
                  value={`item-${index}`}
                  className="border-b border-primary/[0.12]"
                >
                  <AccordionTrigger
                    className="text-left font-display font-semibold text-[0.95rem] text-foreground hover:text-primary py-5 [&[data-state=open]]:text-primary gap-4"
                    onClick={() => handleFAQOpen(index, faq.question)}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[0.9rem] text-muted-foreground leading-[1.7] pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
