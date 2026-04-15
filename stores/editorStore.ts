import { create } from "zustand";
import type { Id } from "@/convex/_generated/dataModel";

export type EditorField =
  | "coupleName"
  | "weddingDate"
  | "weddingTime"
  | "locationWaze"
  | "locationGoogle"
  | "locationApple"
  | "backgroundColor"
  | "colorPrimary"
  | "colorSecondary"
  | "colorAccent"
  | "backgroundImageUrl"
  | "musicYoutubeUrl"
  | "venueName"
  | "venueAddress"
  // Event Details section overrides
  | "eventDetailsBgImageUrl"
  | "eventDetailsBgColor"
  | "eventDetailsColorPrimary"
  | "eventDetailsColorSecondary"
  | "eventDetailsColorAccent"
  // Wishes section overrides
  | "wishesBgImageUrl"
  | "wishesBgColor"
  | "wishesColorPrimary"
  | "wishesColorSecondary"
  | "wishesColorAccent";

export interface EditorState {
  eventId: Id<"events"> | null;
  initialized: boolean;
  coupleName: string;
  weddingDate: string;
  weddingTime: string;
  locationWaze: string;
  locationGoogle: string;
  locationApple: string;
  backgroundColor: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  backgroundImageUrl: string | null;
  musicYoutubeUrl: string;
  venueName: string;
  venueAddress: string;
  // Event Details section overrides
  eventDetailsBgImageUrl: string | null;
  eventDetailsBgColor: string;
  eventDetailsColorPrimary: string;
  eventDetailsColorSecondary: string;
  eventDetailsColorAccent: string;
  // Wishes section overrides
  wishesBgImageUrl: string | null;
  wishesBgColor: string;
  wishesColorPrimary: string;
  wishesColorSecondary: string;
  wishesColorAccent: string;
}

const DEFAULT_STATE: Omit<EditorState, "eventId"> = {
  initialized: false,
  coupleName: "",
  weddingDate: "",
  weddingTime: "",
  locationWaze: "",
  locationGoogle: "",
  locationApple: "",
  backgroundColor: "#f8f4f0",
  colorPrimary: "#1a1a1a",
  colorSecondary: "#c9bfb0",
  colorAccent: "#c9a86c",
  backgroundImageUrl: null,
  musicYoutubeUrl: "",
  venueName: "",
  venueAddress: "",
  // Event Details section overrides
  eventDetailsBgImageUrl: null,
  eventDetailsBgColor: "#f8f4f0",
  eventDetailsColorPrimary: "#1a1a1a",
  eventDetailsColorSecondary: "#c9bfb0",
  eventDetailsColorAccent: "#c9a86c",
  // Wishes section overrides
  wishesBgImageUrl: null,
  wishesBgColor: "#f8f4f0",
  wishesColorPrimary: "#1a1a1a",
  wishesColorSecondary: "#c9bfb0",
  wishesColorAccent: "#c9a86c",
};

interface EditorStore extends EditorState {
  setField: <K extends EditorField>(key: K, value: EditorState[K]) => void;
  initFromEvent: (event: {
    _id: Id<"events">;
    coupleName: string;
    weddingDate: string;
    weddingTime?: string;
    locationWaze?: string;
    locationGoogle?: string;
    locationApple?: string;
    backgroundColor?: string;
    colorPrimary?: string;
    colorSecondary?: string;
    colorAccent?: string;
    backgroundImageUrl?: string | null;
    musicYoutubeUrl?: string;
    venueName?: string;
    venueAddress?: string;
    eventDetailsBgImageUrl?: string | null;
    eventDetailsBgColor?: string;
    eventDetailsColorPrimary?: string;
    eventDetailsColorSecondary?: string;
    eventDetailsColorAccent?: string;
    wishesBgImageUrl?: string | null;
    wishesBgColor?: string;
    wishesColorPrimary?: string;
    wishesColorSecondary?: string;
    wishesColorAccent?: string;
  }) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  eventId: null,
  ...DEFAULT_STATE,

  setField: (key, value) =>
    set((state) => {
      const next = { ...state, [key]: value };
      return next;
    }),

  initFromEvent: (event) =>
    set({
      eventId: event._id,
      initialized: true,
      coupleName: event.coupleName ?? "",
      weddingDate: event.weddingDate ?? "",
      weddingTime: event.weddingTime ?? "",
      locationWaze: event.locationWaze ?? "",
      locationGoogle: event.locationGoogle ?? "",
      locationApple: event.locationApple ?? "",
      backgroundColor: event.backgroundColor ?? DEFAULT_STATE.backgroundColor,
      colorPrimary: event.colorPrimary ?? DEFAULT_STATE.colorPrimary,
      colorSecondary: event.colorSecondary ?? DEFAULT_STATE.colorSecondary,
      colorAccent: event.colorAccent ?? DEFAULT_STATE.colorAccent,
      backgroundImageUrl: event.backgroundImageUrl ?? null,
      musicYoutubeUrl: event.musicYoutubeUrl ?? "",
      venueName: event.venueName ?? "",
      venueAddress: event.venueAddress ?? "",
      eventDetailsBgImageUrl: event.eventDetailsBgImageUrl ?? null,
      eventDetailsBgColor: event.eventDetailsBgColor ?? DEFAULT_STATE.eventDetailsBgColor,
      eventDetailsColorPrimary: event.eventDetailsColorPrimary ?? DEFAULT_STATE.eventDetailsColorPrimary,
      eventDetailsColorSecondary: event.eventDetailsColorSecondary ?? DEFAULT_STATE.eventDetailsColorSecondary,
      eventDetailsColorAccent: event.eventDetailsColorAccent ?? DEFAULT_STATE.eventDetailsColorAccent,
      wishesBgImageUrl: event.wishesBgImageUrl ?? null,
      wishesBgColor: event.wishesBgColor ?? DEFAULT_STATE.wishesBgColor,
      wishesColorPrimary: event.wishesColorPrimary ?? DEFAULT_STATE.wishesColorPrimary,
      wishesColorSecondary: event.wishesColorSecondary ?? DEFAULT_STATE.wishesColorSecondary,
      wishesColorAccent: event.wishesColorAccent ?? DEFAULT_STATE.wishesColorAccent,
    }),

  reset: () =>
    set({
      eventId: null,
      ...DEFAULT_STATE,
    }),
}));
