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
  const eventDetailsBgColor = useEditorStore((s) => s.eventDetailsBgColor);
  const eventDetailsColorPrimary = useEditorStore((s) => s.eventDetailsColorPrimary);
  const eventDetailsColorSecondary = useEditorStore((s) => s.eventDetailsColorSecondary);
  const eventDetailsColorAccent = useEditorStore((s) => s.eventDetailsColorAccent);
  const wishesBgColor = useEditorStore((s) => s.wishesBgColor);
  const wishesColorPrimary = useEditorStore((s) => s.wishesColorPrimary);
  const wishesColorSecondary = useEditorStore((s) => s.wishesColorSecondary);
  const wishesColorAccent = useEditorStore((s) => s.wishesColorAccent);
  const sectionOrder = useEditorStore((s) => s.sectionOrder);
  const sectionsDisabled = useEditorStore((s) => s.sectionsDisabled);
  const invitationFatherBride = useEditorStore((s) => s.invitationFatherBride);
  const invitationMotherBride = useEditorStore((s) => s.invitationMotherBride);
  const invitationFatherGroom = useEditorStore((s) => s.invitationFatherGroom);
  const invitationMotherGroom = useEditorStore((s) => s.invitationMotherGroom);
  const invitationBrideName = useEditorStore((s) => s.invitationBrideName);
  const invitationGroomName = useEditorStore((s) => s.invitationGroomName);
  const invitationWording = useEditorStore((s) => s.invitationWording);
  const jemputanBgColor = useEditorStore((s) => s.jemputanBgColor);
  const jemputanColorPrimary = useEditorStore((s) => s.jemputanColorPrimary);
  const jemputanColorSecondary = useEditorStore((s) => s.jemputanColorSecondary);
  const jemputanColorAccent = useEditorStore((s) => s.jemputanColorAccent);

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
        eventDetailsBgColor: eventDetailsBgColor && isValidHex(eventDetailsBgColor) ? eventDetailsBgColor : undefined,
        eventDetailsColorPrimary: eventDetailsColorPrimary && isValidHex(eventDetailsColorPrimary) ? eventDetailsColorPrimary : undefined,
        eventDetailsColorSecondary: eventDetailsColorSecondary && isValidHex(eventDetailsColorSecondary) ? eventDetailsColorSecondary : undefined,
        eventDetailsColorAccent: eventDetailsColorAccent && isValidHex(eventDetailsColorAccent) ? eventDetailsColorAccent : undefined,
        wishesBgColor: wishesBgColor && isValidHex(wishesBgColor) ? wishesBgColor : undefined,
        wishesColorPrimary: wishesColorPrimary && isValidHex(wishesColorPrimary) ? wishesColorPrimary : undefined,
        wishesColorSecondary: wishesColorSecondary && isValidHex(wishesColorSecondary) ? wishesColorSecondary : undefined,
        wishesColorAccent: wishesColorAccent && isValidHex(wishesColorAccent) ? wishesColorAccent : undefined,
        sectionOrder,
        sectionsDisabled,
        invitationFatherBride: invitationFatherBride || undefined,
        invitationMotherBride: invitationMotherBride || undefined,
        invitationFatherGroom: invitationFatherGroom || undefined,
        invitationMotherGroom: invitationMotherGroom || undefined,
        invitationBrideName: invitationBrideName || undefined,
        invitationGroomName: invitationGroomName || undefined,
        invitationWording: invitationWording || undefined,
        jemputanBgColor: jemputanBgColor && isValidHex(jemputanBgColor) ? jemputanBgColor : undefined,
        jemputanColorPrimary: jemputanColorPrimary && isValidHex(jemputanColorPrimary) ? jemputanColorPrimary : undefined,
        jemputanColorSecondary: jemputanColorSecondary && isValidHex(jemputanColorSecondary) ? jemputanColorSecondary : undefined,
        jemputanColorAccent: jemputanColorAccent && isValidHex(jemputanColorAccent) ? jemputanColorAccent : undefined,
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
    eventDetailsBgColor,
    eventDetailsColorPrimary,
    eventDetailsColorSecondary,
    eventDetailsColorAccent,
    wishesBgColor,
    wishesColorPrimary,
    wishesColorSecondary,
    wishesColorAccent,
    sectionOrder,
    sectionsDisabled,
    invitationFatherBride,
    invitationMotherBride,
    invitationFatherGroom,
    invitationMotherGroom,
    invitationBrideName,
    invitationGroomName,
    invitationWording,
    jemputanBgColor,
    jemputanColorPrimary,
    jemputanColorSecondary,
    jemputanColorAccent,
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
    eventDetailsBgColor,
    eventDetailsColorPrimary,
    eventDetailsColorSecondary,
    eventDetailsColorAccent,
    wishesBgColor,
    wishesColorPrimary,
    wishesColorSecondary,
    wishesColorAccent,
    sectionOrder,
    sectionsDisabled,
    invitationFatherBride,
    invitationMotherBride,
    invitationFatherGroom,
    invitationMotherGroom,
    invitationBrideName,
    invitationGroomName,
    invitationWording,
    jemputanBgColor,
    jemputanColorPrimary,
    jemputanColorSecondary,
    jemputanColorAccent,
    persist,
  ]);

  return saveStatus;
}
