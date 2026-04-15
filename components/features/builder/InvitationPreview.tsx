"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useEditorStore } from "@/stores/editorStore";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import { HeroSection } from "@/components/features/guest/invitation/sections/HeroSection";
import { EventDetailsSection } from "@/components/features/guest/invitation/sections/EventDetailsSection";
import { CarouselSection } from "@/components/features/guest/invitation/sections/CarouselSection";
import { WishesSection } from "@/components/features/guest/invitation/sections/WishesSection";
import { BottomNavbar } from "@/components/features/guest/invitation/navbar/BottomNavbar";

interface InvitationPreviewProps {
  eventId: Id<"events">;
  carouselImageUrls: string[];
}

export function InvitationPreview({
  eventId,
  carouselImageUrls,
}: InvitationPreviewProps) {
  const coupleName = useEditorStore((s) => s.coupleName);
  const weddingDate = useEditorStore((s) => s.weddingDate);
  const weddingTime = useEditorStore((s) => s.weddingTime);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const backgroundImageUrl = useEditorStore((s) => s.backgroundImageUrl);
  const colorPrimary = useEditorStore((s) => s.colorPrimary);
  const colorSecondary = useEditorStore((s) => s.colorSecondary);
  const colorAccent = useEditorStore((s) => s.colorAccent);
  const venueName = useEditorStore((s) => s.venueName);
  const venueAddress = useEditorStore((s) => s.venueAddress);
  const locationWaze = useEditorStore((s) => s.locationWaze);
  const locationGoogle = useEditorStore((s) => s.locationGoogle);
  const locationApple = useEditorStore((s) => s.locationApple);
  const musicYoutubeUrl = useEditorStore((s) => s.musicYoutubeUrl);
  const eventDetailsBgImageUrl = useEditorStore((s) => s.eventDetailsBgImageUrl);
  const eventDetailsBgColor = useEditorStore((s) => s.eventDetailsBgColor);
  const eventDetailsColorPrimary = useEditorStore((s) => s.eventDetailsColorPrimary);
  const eventDetailsColorAccent = useEditorStore((s) => s.eventDetailsColorAccent);
  const wishesBgImageUrl = useEditorStore((s) => s.wishesBgImageUrl);
  const wishesBgColor = useEditorStore((s) => s.wishesBgColor);
  const wishesColorPrimary = useEditorStore((s) => s.wishesColorPrimary);
  const wishesColorSecondary = useEditorStore((s) => s.wishesColorSecondary);
  const wishesColorAccent = useEditorStore((s) => s.wishesColorAccent);

  // Fetch fields not tracked in the editor store
  const event = useQuery(api.events.getEvent, { eventId });

  const locale = event?.language === "en" ? "en-MY" : "ms-MY";
  const displayDate = formatEventDate(weddingDate, locale) ?? "";
  const displayTime = formatEventTime(weddingTime) ?? "";

  return (
    // CSS transform creates a new containing block for position:fixed children
    // so BottomNavbar's fixed positioning is contained within this 390px frame
    <div
      className="relative mx-auto w-full max-w-[390px] overflow-hidden rounded-xl shadow-2xl"
      style={{ transform: "translateZ(0)" }}
    >
      <div style={{ backgroundColor: backgroundColor || "#f8f4f0" }}>
        <HeroSection
          coupleName={coupleName}
          displayDate={displayDate}
          displayTime={displayTime}
          backgroundImageUrl={backgroundImageUrl}
          backgroundColor={backgroundColor || "#f8f4f0"}
          colorPrimary={colorPrimary || "#1a1a1a"}
          colorAccent={colorAccent || "#c9a86c"}
        />

        <EventDetailsSection
          displayDate={displayDate}
          displayTime={displayTime}
          venueName={venueName}
          venueAddress={venueAddress}
          backgroundColor={eventDetailsBgColor || backgroundColor || "#f8f4f0"}
          colorPrimary={eventDetailsColorPrimary || colorPrimary || "#1a1a1a"}
          colorAccent={eventDetailsColorAccent || colorAccent || "#c9a86c"}
          backgroundImageUrl={eventDetailsBgImageUrl}
        />

        {carouselImageUrls.length > 0 && (
          <CarouselSection
            images={carouselImageUrls}
            backgroundColor={backgroundColor || "#f8f4f0"}
            colorAccent={colorAccent || "#c9a86c"}
          />
        )}

        <WishesSection
          eventId={eventId}
          backgroundColor={wishesBgColor || backgroundColor || "#f8f4f0"}
          colorPrimary={wishesColorPrimary || colorPrimary || "#1a1a1a"}
          colorSecondary={wishesColorSecondary || colorSecondary || "#c9bfb0"}
          colorAccent={wishesColorAccent || colorAccent || "#c9a86c"}
          backgroundImageUrl={wishesBgImageUrl}
        />

        {/* Bottom padding to clear fixed navbar */}
        <div className="h-20" />
      </div>

      <BottomNavbar
        eventId={eventId}
        colorAccent={colorAccent || "#c9a86c"}
        backgroundColor={backgroundColor || "#f8f4f0"}
        coupleName={coupleName}
        weddingDate={weddingDate}
        weddingTime={weddingTime}
        venueName={venueName}
        venueAddress={venueAddress}
        locationWaze={locationWaze}
        locationGoogle={locationGoogle}
        locationApple={locationApple}
        donationQrUrl={event?.donationQrUrl ?? null}
        bankName={event?.bankName}
        bankAccount={event?.bankAccount}
        bankHolder={event?.bankHolder}
        rsvpDeadline={event?.rsvpDeadline}
        musicYoutubeUrl={musicYoutubeUrl}
      />
    </div>
  );
}
