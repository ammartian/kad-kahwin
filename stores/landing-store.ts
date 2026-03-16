import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LandingStore {
  // Waitlist modal
  isWaitlistModalOpen: boolean;
  waitlistModalTrigger: "hero" | "secondary_cta" | "footer" | null;
  openWaitlistModal: (trigger: "hero" | "secondary_cta" | "footer") => void;
  closeWaitlistModal: () => void;

  // Language
  language: "ms" | "en";
  setLanguage: (lang: "ms" | "en") => void;
  toggleLanguage: () => void;
}

// Safe storage for SSR - localStorage only on client
const getStorage = (): Storage =>
  typeof window !== "undefined"
    ? localStorage
    : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        length: 0,
        clear: () => {},
        key: () => null,
      };

export const useLandingStore = create<LandingStore>()(
  persist(
    (set) => ({
      // Waitlist modal state
      isWaitlistModalOpen: false,
      waitlistModalTrigger: null,
      openWaitlistModal: (trigger) =>
        set({ isWaitlistModalOpen: true, waitlistModalTrigger: trigger }),
      closeWaitlistModal: () =>
        set({ isWaitlistModalOpen: false, waitlistModalTrigger: null }),

      // Language state - defaults to Malay
      language: "ms",
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () =>
        set((state) => ({
          language: state.language === "ms" ? "en" : "ms",
        })),
    }),
    {
      name: "kad-kahwin-language",
      storage: createJSONStorage(getStorage),
      partialize: (state) => ({ language: state.language }),
    }
  )
);
