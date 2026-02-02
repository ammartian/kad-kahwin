import { create } from "zustand";

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

export const useLandingStore = create<LandingStore>((set) => ({
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
}));
