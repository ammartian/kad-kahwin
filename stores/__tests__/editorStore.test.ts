import { describe, it, expect, beforeEach } from "vitest";
import type { Id } from "@/convex/_generated/dataModel";
import { useEditorStore } from "../editorStore";

describe("editorStore: initFromEvent", () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it("populates all fields from event", () => {
    const event = {
      _id: "event-123" as Id<"events">,
      coupleName: "Ahmad & Siti",
      weddingDate: "2030-06-15",
      weddingTime: "14:00",
      locationWaze: "https://waze.com/ul/...",
      locationGoogle: "https://maps.google.com/...",
      locationApple: "https://maps.apple.com/...",
      backgroundColor: "#f0f0f0",
      colorPrimary: "#111111",
      colorSecondary: "#222222",
      colorAccent: "#c9a86c",
      backgroundImageUrl: "https://storage.example.com/bg.jpg",
      musicYoutubeUrl: "https://youtube.com/watch?v=abc",
      venueName: "Grand Ballroom KLCC",
      venueAddress: "50088 Kuala Lumpur",
    };

    useEditorStore.getState().initFromEvent(event);

    const state = useEditorStore.getState();
    expect(state.eventId).toBe("event-123");
    expect(state.initialized).toBe(true);
    expect(state.coupleName).toBe("Ahmad & Siti");
    expect(state.weddingDate).toBe("2030-06-15");
    expect(state.weddingTime).toBe("14:00");
    expect(state.locationWaze).toBe("https://waze.com/ul/...");
    expect(state.locationGoogle).toBe("https://maps.google.com/...");
    expect(state.locationApple).toBe("https://maps.apple.com/...");
    expect(state.backgroundColor).toBe("#f0f0f0");
    expect(state.colorPrimary).toBe("#111111");
    expect(state.colorSecondary).toBe("#222222");
    expect(state.colorAccent).toBe("#c9a86c");
    expect(state.backgroundImageUrl).toBe("https://storage.example.com/bg.jpg");
    expect(state.musicYoutubeUrl).toBe("https://youtube.com/watch?v=abc");
    expect(state.venueName).toBe("Grand Ballroom KLCC");
    expect(state.venueAddress).toBe("50088 Kuala Lumpur");
  });

  it("does not contain carouselImageUrls (removed from store — lives as prop)", () => {
    useEditorStore.getState().initFromEvent({
      _id: "event-123" as Id<"events">,
      coupleName: "Ahmad & Siti",
      weddingDate: "2030-06-15",
    });

    const state = useEditorStore.getState();
    expect("carouselImageUrls" in state).toBe(false);
  });

  it("falls back to defaults for missing optional fields", () => {
    const event = {
      _id: "event-456" as Id<"events">,
      coupleName: "John & Jane",
      weddingDate: "2030-01-01",
    };

    useEditorStore.getState().initFromEvent(event);

    const state = useEditorStore.getState();
    expect(state.coupleName).toBe("John & Jane");
    expect(state.weddingDate).toBe("2030-01-01");
    expect(state.weddingTime).toBe("");
    expect(state.locationWaze).toBe("");
    expect(state.locationGoogle).toBe("");
    expect(state.locationApple).toBe("");
    expect(state.backgroundColor).toBe("#f8f4f0");
    expect(state.colorPrimary).toBe("#1a1a1a");
    expect(state.colorSecondary).toBe("#c9bfb0");
    expect(state.colorAccent).toBe("#c9a86c");
    expect(state.backgroundImageUrl).toBeNull();
    expect(state.musicYoutubeUrl).toBe("");
    expect(state.venueName).toBe("");
    expect(state.venueAddress).toBe("");
  });
});

describe("editorStore: setField", () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it("updates single field without touching others", () => {
    useEditorStore.getState().initFromEvent({
      _id: "event-1" as Id<"events">,
      coupleName: "Original",
      weddingDate: "2030-01-01",
    });

    useEditorStore.getState().setField("coupleName", "Updated Name");

    const state = useEditorStore.getState();
    expect(state.coupleName).toBe("Updated Name");
    expect(state.weddingDate).toBe("2030-01-01");
    expect(state.backgroundColor).toBe("#f8f4f0");
  });

  it("updates color fields", () => {
    useEditorStore.getState().initFromEvent({
      _id: "event-1" as Id<"events">,
      coupleName: "Test",
      weddingDate: "2030-01-01",
    });

    useEditorStore.getState().setField("colorPrimary", "#ff0000");

    expect(useEditorStore.getState().colorPrimary).toBe("#ff0000");
  });
});

describe("editorStore: reset", () => {
  it("clears eventId and restores all defaults", () => {
    useEditorStore.getState().initFromEvent({
      _id: "event-1" as Id<"events">,
      coupleName: "Test",
      weddingDate: "2030-01-01",
      colorPrimary: "#ff0000",
    });

    useEditorStore.getState().reset();

    const state = useEditorStore.getState();
    expect(state.eventId).toBeNull();
    expect(state.initialized).toBe(false);
    expect(state.coupleName).toBe("");
    expect(state.weddingDate).toBe("");
    expect(state.colorPrimary).toBe("#1a1a1a");
    expect(state.backgroundColor).toBe("#f8f4f0");
  });
});

describe("editorStore: initialized flag", () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it("is false before initFromEvent", () => {
    expect(useEditorStore.getState().initialized).toBe(false);
  });

  it("is true after initFromEvent", () => {
    useEditorStore.getState().initFromEvent({
      _id: "event-1" as Id<"events">,
      coupleName: "Test",
      weddingDate: "2030-01-01",
    });
    expect(useEditorStore.getState().initialized).toBe(true);
  });

  it("is false after reset", () => {
    useEditorStore.getState().initFromEvent({
      _id: "event-1" as Id<"events">,
      coupleName: "Test",
      weddingDate: "2030-01-01",
    });
    useEditorStore.getState().reset();
    expect(useEditorStore.getState().initialized).toBe(false);
  });
});
