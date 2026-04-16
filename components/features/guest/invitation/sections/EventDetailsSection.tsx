"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EventDetailsSectionProps {
  displayDate: string;
  displayTime: string;
  venueName?: string;
  venueAddress?: string;
  backgroundColor: string;
  colorPrimary: string;
  colorAccent: string;
  backgroundImageUrl?: string | null;
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
  title: string;
  value: string;
  index: number;
  colorAccent: string;
  shouldReduceMotion: boolean | null;
}

function DetailCard({ icon, title, value, index, colorAccent, shouldReduceMotion }: DetailCardProps) {
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
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest opacity-60">{title}</p>
        <p
          className="mt-0.5 text-base font-semibold leading-tight"
          style={{ color: colorAccent }}
        >
          {value}
        </p>
      </div>
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
  backgroundImageUrl,
}: EventDetailsSectionProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const cards = [
    displayDate && { icon: <Calendar className="h-5 w-5" />, title: t("guest.card_date"), value: displayDate },
    displayTime && { icon: <Clock className="h-5 w-5" />, title: t("guest.card_time"), value: displayTime },
    venueName && { icon: <MapPin className="h-5 w-5" />, title: t("guest.card_venue"), value: venueName },
    venueAddress && { icon: <MapPin className="h-4 w-4" />, title: t("guest.card_address"), value: venueAddress },
  ].filter(Boolean) as { icon: React.ReactNode; title: string; value: string }[];

  if (cards.length === 0) return null;

  return (
    <section
      className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor }}
    >
      {backgroundImageUrl && (
        <div className="absolute inset-0">
          {backgroundImageUrl.startsWith("blob:") ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={backgroundImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Image src={backgroundImageUrl} alt="" fill className="object-cover" sizes="390px" />
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      {/* Content sits above background image */}
      <div className="relative z-10 w-full">

      {/* Section title */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="mb-2 text-xs tracking-[0.3em] uppercase" style={{ color: colorAccent }}>
          {t("guest.event_details_title")}
        </div>
        <div className="mx-auto h-px w-16" style={{ backgroundColor: colorAccent }} />
      </motion.div>

      {/* Cards */}
      <div className="w-full space-y-4" style={{ color: colorPrimary }}>
        {cards.map((card, i) => (
          <DetailCard
            key={i}
            icon={card.icon}
            title={card.title}
            value={card.value}
            index={i}
            colorAccent={colorAccent}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>

      </div>{/* end relative z-10 */}
    </section>
  );
}
