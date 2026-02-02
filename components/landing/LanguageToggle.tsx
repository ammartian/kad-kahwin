"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLandingStore } from "@/stores/landing-store";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLandingStore();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-1">
      <button
        onClick={() => setLanguage("ms")}
        className={cn(
          "relative px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
          language === "ms"
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {language === "ms" && (
          <motion.div
            layoutId="language-indicator"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">{t("language.ms")}</span>
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "relative px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
          language === "en"
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {language === "en" && (
          <motion.div
            layoutId="language-indicator"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">{t("language.en")}</span>
      </button>
    </div>
  );
}
