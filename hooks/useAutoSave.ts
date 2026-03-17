"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useEditorStore } from "@/stores/editorStore";
import { isValidHex } from "@/lib/utils";

const DEBOUNCE_MS = 500;

export type SaveStatus = "idle" | "saving" | "error";

export function useAutoSave(eventId: Id<"events">): SaveStatus {
  const updateEvent = useMutation(api.events.updateEvent);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const coupleName = useEditorStore((s) => s.coupleName);
  const weddingDate = useEditorStore((s) => s.weddingDate);
  const weddingTime = useEditorStore((s) => s.weddingTime);
  const locationWaze = useEditorStore((s) => s.locationWaze);
  const locationGoogle = useEditorStore((s) => s.locationGoogle);
  const locationApple = useEditorStore((s) => s.locationApple);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const colorPrimary = useEditorStore((s) => s.colorPrimary);
  const colorSecondary = useEditorStore((s) => s.colorSecondary);
  const colorAccent = useEditorStore((s) => s.colorAccent);
  const musicYoutubeUrl = useEditorStore((s) => s.musicYoutubeUrl);
  const venueName = useEditorStore((s) => s.venueName);
  const venueAddress = useEditorStore((s) => s.venueAddress);
  const initialized = useEditorStore((s) => s.initialized);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(async () => {
    setSaveStatus("saving");
    try {
      await updateEvent({
        eventId,
        coupleName: coupleName || undefined,
        weddingDate: weddingDate || undefined,
        weddingTime: weddingTime || undefined,
        locationWaze: locationWaze || undefined,
        locationGoogle: locationGoogle || undefined,
        locationApple: locationApple || undefined,
        backgroundColor: backgroundColor && isValidHex(backgroundColor) ? backgroundColor : undefined,
        colorPrimary: colorPrimary && isValidHex(colorPrimary) ? colorPrimary : undefined,
        colorSecondary: colorSecondary && isValidHex(colorSecondary) ? colorSecondary : undefined,
        colorAccent: colorAccent && isValidHex(colorAccent) ? colorAccent : undefined,
        musicYoutubeUrl: musicYoutubeUrl || undefined,
        venueName: venueName || undefined,
        venueAddress: venueAddress || undefined,
      });
      setSaveStatus("idle");
    } catch {
      setSaveStatus("error");
    }
  }, [
    eventId,
    updateEvent,
    coupleName,
    weddingDate,
    weddingTime,
    locationWaze,
    locationGoogle,
    locationApple,
    backgroundColor,
    colorPrimary,
    colorSecondary,
    colorAccent,
    musicYoutubeUrl,
    venueName,
    venueAddress,
  ]);

  useEffect(() => {
    if (!initialized) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      persist();
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    initialized,
    coupleName,
    weddingDate,
    weddingTime,
    locationWaze,
    locationGoogle,
    locationApple,
    backgroundColor,
    colorPrimary,
    colorSecondary,
    colorAccent,
    musicYoutubeUrl,
    venueName,
    venueAddress,
    persist,
  ]);

  return saveStatus;
}
