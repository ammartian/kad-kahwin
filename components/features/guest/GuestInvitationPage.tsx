"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import { useEventLanguage } from "@/hooks/useEventLanguage";
import { InvitationContainer } from "./invitation/InvitationContainer";
import { HeroSection } from "./invitation/sections/HeroSection";
import { EventDetailsSection } from "./invitation/sections/EventDetailsSection";
import { CarouselSection } from "./invitation/sections/CarouselSection";
import { WishesSection } from "./invitation/sections/WishesSection";
import { BottomNavbar } from "./invitation/navbar/BottomNavbar";

interface GuestInvitationPageProps {
  slug: string;
}

export function GuestInvitationPage({ slug }: GuestInvitationPageProps) {
  const { t } = useTranslation();
  const event = useQuery(api.guest.getEventBySlug, { slug });
  const [guestName, setGuestName] = useState<string | null>(null);

  useEventLanguage(event?.language);

  if (event === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-6">
        <p className="text-center text-gray-600">{t("guest.not_found")}</p>
      </div>
    );
  }

  const backgroundColor = event.backgroundColor ?? "#f8f4f0";
  const backgroundImageUrl = event.backgroundImageUrl ?? null;
  const colorPrimary = event.colorPrimary ?? "#1a1a1a";
  const colorAccent = event.colorAccent ?? "#c9a86c";

  const locale = event.language === "en" ? "en-MY" : "ms-MY";
  const displayDate = formatEventDate(event.weddingDate, locale) ?? "";
  const displayTime = formatEventTime(event.weddingTime) ?? "";

  const carouselImages = event.carouselImageUrls ?? [];

  return (
    <InvitationContainer
      backgroundColor={backgroundColor}
      backgroundImageUrl={backgroundImageUrl}
    >
      {/* All sections share the same bg color */}
      <div style={{ backgroundColor }}>
        <HeroSection
          coupleName={event.coupleName}
          displayDate={displayDate}
          displayTime={displayTime}
          backgroundImageUrl={backgroundImageUrl}
          backgroundColor={backgroundColor}
          colorPrimary={colorPrimary}
          colorAccent={colorAccent}
        />

        <EventDetailsSection
          displayDate={displayDate}
          displayTime={displayTime}
          venueName={event.venueName}
          venueAddress={event.venueAddress}
          backgroundColor={backgroundColor}
          colorPrimary={colorPrimary}
          colorAccent={colorAccent}
        />

        {carouselImages.length > 0 && (
          <CarouselSection
            images={carouselImages}
            backgroundColor={backgroundColor}
            colorAccent={colorAccent}
          />
        )}

        <WishesSection
          eventId={event._id}
          backgroundColor={backgroundColor}
          colorPrimary={colorPrimary}
          colorAccent={colorAccent}
        />

        {/* Bottom padding to clear fixed navbar */}
        <div className="h-20" />
      </div>

      <BottomNavbar
        eventId={event._id}
        colorAccent={colorAccent}
        backgroundColor={backgroundColor}
        coupleName={event.coupleName}
        weddingDate={event.weddingDate}
        weddingTime={event.weddingTime}
        venueName={event.venueName}
        venueAddress={event.venueAddress}
        locationWaze={event.locationWaze}
        locationGoogle={event.locationGoogle}
        locationApple={event.locationApple}
        donationQrUrl={event.donationQrUrl}
        bankName={event.bankName}
        bankAccount={event.bankAccount}
        bankHolder={event.bankHolder}
        rsvpDeadline={event.rsvpDeadline}
        musicYoutubeUrl={event.musicYoutubeUrl}
        guestName={guestName}
        onGuestNameUsed={setGuestName}
      />
    </InvitationContainer>
  );
}
