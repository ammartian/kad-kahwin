import { create } from "zustand";

interface LandingStore {
  // Waitlist modal
  isWaitlistModalOpen: boolean;
  openWaitlistModal: () => void;
  closeWaitlistModal: () => void;

  // Language
  language: "ms" | "en";
  setLanguage: (lang: "ms" | "en") => void;
  toggleLanguage: () => void;
}

export const useLandingStore = create<LandingStore>((set) => ({
  // Waitlist modal state
  isWaitlistModalOpen: false,
  openWaitlistModal: () => set({ isWaitlistModalOpen: true }),
  closeWaitlistModal: () => set({ isWaitlistModalOpen: false }),

  // Language state - defaults to Malay
  language: "ms",
  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () =>
    set((state) => ({
      language: state.language === "ms" ? "en" : "ms",
    })),
}));
