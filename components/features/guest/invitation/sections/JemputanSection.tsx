"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface JemputanSectionProps {
  fatherBride?: string;
  motherBride?: string;
  fatherGroom?: string;
  motherGroom?: string;
  brideName?: string;
  groomName?: string;
  invitationWording?: string;
  language: "ms" | "en";
  backgroundColor: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  backgroundImageUrl?: string | null;
}

export function JemputanSection({
  fatherBride,
  motherBride,
  fatherGroom,
  motherGroom,
  brideName,
  groomName,
  invitationWording,
  language,
  backgroundColor,
  colorPrimary,
  colorAccent,
  backgroundImageUrl,
}: JemputanSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const hasContent =
    fatherBride || motherBride || fatherGroom || motherGroom ||
    brideName || groomName || invitationWording;

  if (!hasContent) return null;

  const hasBrideSide = fatherBride || motherBride;
  const hasGroomSide = fatherGroom || motherGroom;

  const header =
    language === "en"
      ? "With the blessings of Allah\nWe joyfully invite you"
      : "Dengan Hormatnya Kami\nMenjemput Tuan/Puan";

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor }}
    >
      {backgroundImageUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={shouldReduceMotion ? {} : { scale: [1, 1.05] }}
            transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          >
            <Image
              src={backgroundImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="390px"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        {/* Ornament */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 text-xl tracking-widest"
          style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.8)" : colorAccent }}
          aria-hidden="true"
        >
          ✦ ✦ ✦
        </motion.div>

        {/* Invitation wording block */}
        {invitationWording ? (
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 whitespace-pre-line text-sm italic leading-relaxed"
            style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.85)" : colorAccent }}
          >
            {invitationWording}
          </motion.p>
        ) : (
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 whitespace-pre-line text-sm italic leading-relaxed"
            style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.85)" : colorAccent }}
          >
            {header}
          </motion.p>
        )}

        {/* Parents */}
        {(hasBrideSide || hasGroomSide) && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6 space-y-4 w-full"
          >
            {hasBrideSide && (
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-widest mb-1"
                  style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.5)" : colorAccent }}
                >
                  {language === "en" ? "Bride's Parents" : "Ibubapa Pengantin Perempuan"}
                </p>
                {fatherBride && (
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.9)" : colorPrimary }}
                  >
                    {fatherBride}
                  </p>
                )}
                {fatherBride && motherBride && (
                  <p className="text-xs my-0.5" style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.4)" : colorAccent }}>
                    &amp;
                  </p>
                )}
                {motherBride && (
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.9)" : colorPrimary }}
                  >
                    {motherBride}
                  </p>
                )}
              </div>
            )}

            {hasBrideSide && hasGroomSide && (
              <div
                className="h-px w-16 mx-auto"
                style={{ backgroundColor: backgroundImageUrl ? "rgba(255,255,255,0.3)" : colorAccent }}
              />
            )}

            {hasGroomSide && (
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-widest mb-1"
                  style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.5)" : colorAccent }}
                >
                  {language === "en" ? "Groom's Parents" : "Ibubapa Pengantin Lelaki"}
                </p>
                {fatherGroom && (
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.9)" : colorPrimary }}
                  >
                    {fatherGroom}
                  </p>
                )}
                {fatherGroom && motherGroom && (
                  <p className="text-xs my-0.5" style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.4)" : colorAccent }}>
                    &amp;
                  </p>
                )}
                {motherGroom && (
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.9)" : colorPrimary }}
                  >
                    {motherGroom}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Divider */}
        {(brideName || groomName) && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-6 h-px w-24"
            style={{ backgroundColor: backgroundImageUrl ? "rgba(255,255,255,0.4)" : colorAccent }}
          />
        )}

        {/* Couple names */}
        {(brideName || groomName) && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="space-y-1"
          >
            {brideName && (
              <p
                className="text-3xl font-bold leading-tight tracking-wide"
                style={{
                  color: backgroundImageUrl ? "#ffffff" : colorPrimary,
                  fontFamily: "'Playfair Display', serif",
                  textShadow: backgroundImageUrl ? "0 2px 8px rgba(0,0,0,0.4)" : "none",
                }}
              >
                {brideName}
              </p>
            )}
            {brideName && groomName && (
              <p
                className="text-lg"
                style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.7)" : colorAccent }}
              >
                &amp;
              </p>
            )}
            {groomName && (
              <p
                className="text-3xl font-bold leading-tight tracking-wide"
                style={{
                  color: backgroundImageUrl ? "#ffffff" : colorPrimary,
                  fontFamily: "'Playfair Display', serif",
                  textShadow: backgroundImageUrl ? "0 2px 8px rgba(0,0,0,0.4)" : "none",
                }}
              >
                {groomName}
              </p>
            )}
          </motion.div>
        )}

        {/* Bottom ornament */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8 text-xl tracking-widest"
          style={{ color: backgroundImageUrl ? "rgba(255,255,255,0.5)" : colorAccent }}
          aria-hidden="true"
        >
          ✦ ✦ ✦
        </motion.div>
      </div>
    </section>
  );
}
