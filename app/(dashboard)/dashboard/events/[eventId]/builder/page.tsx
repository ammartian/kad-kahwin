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

  // Init store from event when data is ready
  useEffect(() => {
    if (event && event._id === eventId && !initialized) {
      setCarouselImageIds((event.carouselImageIds ?? []) as Id<"_storage">[]);
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
        carouselImageUrls: event.carouselImageUrls ?? [],
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
      onCarouselIdsChange={setCarouselImageIds}
    />
  );
}
