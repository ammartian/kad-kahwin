"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_ADVANCE_MS = 4000;
const RESUME_AFTER_INTERACTION_MS = 8000;

interface CarouselSectionProps {
  images: string[];
  backgroundColor: string;
  colorAccent: string;
}

export function CarouselSection({ images, backgroundColor, colorAccent }: CarouselSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setCurrent((index + images.length) % images.length);
    },
    [images.length]
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  const pauseAutoAdvance = useCallback(() => {
    isPausedRef.current = true;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    autoAdvanceRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setDirection(1);
        setCurrent((c) => (c + 1) % images.length);
      }
    }, AUTO_ADVANCE_MS);
    return () => {
      if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [images.length]);

  if (images.length === 0) return null;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="w-full py-8"
      style={{ backgroundColor }}
    >
      {/* Carousel frame */}
      <div
        className="relative mx-auto w-full overflow-hidden"
        style={{ aspectRatio: "16/9" }}
        onTouchStart={pauseAutoAdvance}
        onClick={pauseAutoAdvance}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={shouldReduceMotion ? {} : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[current]}
              alt={`Photo ${current + 1}`}
              fill
              className="object-cover"
              sizes="390px"
              loading={current === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrow buttons (desktop) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                pauseAutoAdvance();
                prev();
              }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition-opacity hover:bg-black/50"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                pauseAutoAdvance();
                next();
              }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-1 text-white backdrop-blur-sm transition-opacity hover:bg-black/50"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                pauseAutoAdvance();
                goTo(i, i > current ? 1 : -1);
              }}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === current ? "20px" : "8px",
                backgroundColor: i === current ? colorAccent : `${colorAccent}60`,
              }}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
