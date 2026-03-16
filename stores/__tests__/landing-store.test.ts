/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { useLandingStore } from "../landing-store";

const STORAGE_KEY = "kad-kahwin-language";

describe("landing-store: language state and persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    useLandingStore.setState({
      language: "ms",
      isWaitlistModalOpen: false,
      waitlistModalTrigger: null,
    });
  });

  it("defaults language to ms", () => {
    expect(useLandingStore.getState().language).toBe("ms");
  });

  it("setLanguage updates language to en", () => {
    useLandingStore.getState().setLanguage("en");
    expect(useLandingStore.getState().language).toBe("en");
  });

  it("setLanguage updates language to ms", () => {
    useLandingStore.getState().setLanguage("en");
    useLandingStore.getState().setLanguage("ms");
    expect(useLandingStore.getState().language).toBe("ms");
  });

  it("toggleLanguage switches from ms to en", () => {
    useLandingStore.getState().toggleLanguage();
    expect(useLandingStore.getState().language).toBe("en");
  });

  it("toggleLanguage switches from en to ms", () => {
    useLandingStore.getState().setLanguage("en");
    useLandingStore.getState().toggleLanguage();
    expect(useLandingStore.getState().language).toBe("ms");
  });

  it("persists language to localStorage when setLanguage is called", () => {
    useLandingStore.getState().setLanguage("en");

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.language).toBe("en");
  });

  it("persists only language when partialize is applied (not waitlist state)", () => {
    useLandingStore.getState().openWaitlistModal("hero");
    useLandingStore.getState().setLanguage("en");

    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw!);
    expect(parsed.state).toEqual({ language: "en" });
    expect(parsed.state).not.toHaveProperty("isWaitlistModalOpen");
    expect(parsed.state).not.toHaveProperty("waitlistModalTrigger");
  });

  it("rehydrates language from localStorage on persist.rehydrate", async () => {
    // Use the same format the store writes (setLanguage then read back)
    useLandingStore.getState().setLanguage("en");
    const stored = localStorage.getItem(STORAGE_KEY);
    localStorage.clear();
    useLandingStore.setState({ language: "ms" });
    localStorage.setItem(STORAGE_KEY, stored!);

    await useLandingStore.persist.rehydrate();

    expect(useLandingStore.getState().language).toBe("en");
  });
});
