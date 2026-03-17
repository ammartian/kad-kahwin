"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useEventLanguage(language: "ms" | "en" | undefined) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);
}
