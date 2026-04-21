"use client";

import { useTranslation } from "react-i18next";
import { Play, Pause, Music2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MusicModalProps {
  isPlaying: boolean;
  onToggle: () => void;
  colorAccent: string;
  hasMusic: boolean;
}

export function MusicModal({ isPlaying, onToggle, colorAccent, hasMusic }: MusicModalProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="px-6 pb-8 pt-4">
      <h2 className="mb-6 text-center text-lg font-semibold">{t("music_modal.title")}</h2>

      {!hasMusic ? (
        <p className="text-center text-sm text-gray-400">Tiada muzik dipasang untuk majlis ini.</p>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Album art placeholder */}
          <div
            className="relative flex h-32 w-32 items-center justify-center rounded-full"
            style={{ backgroundColor: `${colorAccent}20` }}
          >
            <AnimatePresence>
              {isPlaying && !shouldReduceMotion && (
                <>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: colorAccent }}
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1 + i * 0.3, opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
            <Music2 className="h-12 w-12" style={{ color: colorAccent }} />
          </div>

          {/* Status */}
          <p className="text-sm text-gray-500">
            {isPlaying ? t("music_modal.now_playing") : t("music_modal.title")}
          </p>

          {/* Play/Pause button */}
          <Button
            type="button"
            onClick={onToggle}
            className="h-14 w-14 rounded-full text-white"
            style={{ backgroundColor: colorAccent }}
            aria-label={isPlaying ? t("music_modal.pause") : t("music_modal.play")}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 translate-x-0.5" />
            )}
          </Button>

          <p className="text-xs text-gray-400">{t("music_modal.powered_by")}</p>
        </div>
      )}
    </div>
  );
}
