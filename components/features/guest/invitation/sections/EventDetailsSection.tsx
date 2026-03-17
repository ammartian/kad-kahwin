"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventDetailsSectionProps {
  displayDate: string;
  displayTime: string;
  venueName?: string;
  venueAddress?: string;
  backgroundColor: string;
  colorPrimary: string;
  colorAccent: string;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 },
  }),
};

interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  index: number;
  colorAccent: string;
  shouldReduceMotion: boolean | null;
}

function DetailCard({ icon, label, index, colorAccent, shouldReduceMotion }: DetailCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="flex items-center gap-4 rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-sm"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20"
        style={{ color: colorAccent }}
      >
        {icon}
      </div>
      <p className="text-sm font-medium leading-snug">{label}</p>
    </motion.div>
  );
}

export function EventDetailsSection({
  displayDate,
  displayTime,
  venueName,
  venueAddress,
  backgroundColor,
  colorPrimary,
  colorAccent,
}: EventDetailsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const cards = [
    displayDate && { icon: <Calendar className="h-5 w-5" />, label: displayDate },
    displayTime && { icon: <Clock className="h-5 w-5" />, label: displayTime },
    venueName && { icon: <MapPin className="h-5 w-5" />, label: venueName },
    venueAddress && { icon: <MapPin className="h-4 w-4" />, label: venueAddress },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  if (cards.length === 0) return null;

  return (
    <section
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor }}
    >
      {/* Section title */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="mb-2 text-xs tracking-[0.3em] uppercase" style={{ color: colorAccent }}>
          Butiran Majlis
        </div>
        <div className="mx-auto h-px w-16" style={{ backgroundColor: colorAccent }} />
      </motion.div>

      {/* Cards */}
      <div className="w-full space-y-4" style={{ color: colorPrimary }}>
        {cards.map((card, i) => (
          <DetailCard
            key={i}
            icon={card.icon}
            label={card.label}
            index={i}
            colorAccent={colorAccent}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>
    </section>
  );
}
