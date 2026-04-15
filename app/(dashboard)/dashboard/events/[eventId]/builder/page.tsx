"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useEditorStore } from "@/stores/editorStore";
import { BuilderLayout } from "@/components/features/builder/BuilderLayout";

export default function BuilderPage() {
  const params = useParams();
  const eventId = params.eventId as Id<"events">;
  const event = useQuery(api.events.getEvent, { eventId });
  const initialized = useEditorStore((s) => s.initialized);
  const initFromEvent = useEditorStore((s) => s.initFromEvent);
  const reset = useEditorStore((s) => s.reset);
  const [carouselImageIds, setCarouselImageIds] = useState<Id<"_storage">[]>([]);
  const [carouselImageUrls, setCarouselImageUrls] = useState<string[]>([]);

  // Always sync carousel from the reactive Convex query so new uploads appear immediately.
  // Only call initFromEvent once to avoid overwriting in-progress edits.
  useEffect(() => {
    if (!event || event._id !== eventId) return;
    setCarouselImageIds((event.carouselImageIds ?? []) as Id<"_storage">[]);
    setCarouselImageUrls(event.carouselImageUrls ?? []);
    if (!initialized) {
      initFromEvent({
        _id: event._id,
        coupleName: event.coupleName,
        weddingDate: event.weddingDate,
        weddingTime: event.weddingTime,
        locationWaze: event.locationWaze,
        locationGoogle: event.locationGoogle,
        locationApple: event.locationApple,
        backgroundColor: event.backgroundColor,
        colorPrimary: event.colorPrimary,
        colorSecondary: event.colorSecondary,
        colorAccent: event.colorAccent,
        backgroundImageUrl: event.backgroundImageUrl ?? null,
        musicYoutubeUrl: event.musicYoutubeUrl,
        venueName: event.venueName,
        venueAddress: event.venueAddress,
        eventDetailsBgImageUrl: event.eventDetailsBgImageUrl ?? null,
        eventDetailsBgColor: event.eventDetailsBgColor,
        eventDetailsColorPrimary: event.eventDetailsColorPrimary,
        eventDetailsColorSecondary: event.eventDetailsColorSecondary,
        eventDetailsColorAccent: event.eventDetailsColorAccent,
        wishesBgImageUrl: event.wishesBgImageUrl ?? null,
        wishesBgColor: event.wishesBgColor,
        wishesColorPrimary: event.wishesColorPrimary,
        wishesColorSecondary: event.wishesColorSecondary,
        wishesColorAccent: event.wishesColorAccent,
      });
    }
  }, [event, eventId, initialized, initFromEvent]);

  // Reset store only on unmount (navigating away from builder)
  useEffect(() => {
    return () => reset();
  }, [reset]);

  if (event === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <p className="text-muted-foreground">Event not found or you don&apos;t have access.</p>
      </div>
    );
  }

  return (
    <BuilderLayout
      eventId={eventId}
      carouselImageIds={carouselImageIds}
      carouselImageUrls={carouselImageUrls}
      onCarouselIdsChange={setCarouselImageIds}
      onCarouselUrlsChange={setCarouselImageUrls}
    />
  );
}
