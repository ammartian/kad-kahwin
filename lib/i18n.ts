import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ms from "@/locales/ms.json";
import en from "@/locales/en.json";

export const defaultNS = "translation";
export const resources = {
  ms: { translation: ms },
  en: { translation: en },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "ms", // Default language - Malay first
  fallbackLng: "ms",
  defaultNS,
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export default i18n;
