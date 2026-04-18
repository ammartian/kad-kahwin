"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import { useEventLanguage } from "@/hooks/useEventLanguage";
import { InvitationContainer } from "./invitation/InvitationContainer";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { HeroSection } from "./invitation/sections/HeroSection";
import { EventDetailsSection } from "./invitation/sections/EventDetailsSection";
import { CarouselSection } from "./invitation/sections/CarouselSection";
import { WishesTickerSection } from "./invitation/sections/WishesTickerSection";
import { JemputanSection } from "./invitation/sections/JemputanSection";
import { WishInputModal } from "./invitation/WishInputModal";
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
    return <LoadingScreen />;
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
  const colorSecondary = event.colorSecondary ?? "#c9bfb0";
  const colorAccent = event.colorAccent ?? "#c9a86c";

  // Per-section overrides (fall back to global)
  const eventDetailsBg = event.eventDetailsBgColor ?? backgroundColor;
  const eventDetailsBgImage = event.eventDetailsBgImageUrl ?? null;
  const eventDetailsPrimary = event.eventDetailsColorPrimary ?? colorPrimary;
  const eventDetailsAccent = event.eventDetailsColorAccent ?? colorAccent;

  const wishesBg = event.wishesBgColor ?? backgroundColor;
  const wishesBgImage = event.wishesBgImageUrl ?? null;
  const wishesPrimary = event.wishesColorPrimary ?? colorPrimary;
  const wishesSecondary = event.wishesColorSecondary ?? colorSecondary;
  const wishesAccent = event.wishesColorAccent ?? colorAccent;

  const jemputanBg = event.jemputanBgColor ?? backgroundColor;
  const jemputanBgImage = event.jemputanBgImageUrl ?? null;
  const jemputanPrimary = event.jemputanColorPrimary ?? colorPrimary;
  const jemputanSecondary = event.jemputanColorSecondary ?? colorSecondary;
  const jemputanAccent = event.jemputanColorAccent ?? colorAccent;

  const locale = event.language === "en" ? "en-MY" : "ms-MY";
  const displayDate = formatEventDate(event.weddingDate, locale) ?? "";
  const displayTime = formatEventTime(event.weddingTime) ?? "";

  const carouselImages = event.carouselImageUrls ?? [];

  const DEFAULT_ORDER = ["landing", "jemputan", "details", "photos", "wishes"];
  const order = event.sectionOrder ?? DEFAULT_ORDER;
  const disabled = new Set(event.sectionsDisabled ?? []);
  const orderedSections = ["landing", ...order.filter((s) => s !== "landing")];

  return (
    <InvitationContainer
      backgroundColor={backgroundColor}
      backgroundImageUrl={backgroundImageUrl}
    >
      <div
        style={{ backgroundColor }}
        className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        {orderedSections.map((key) => {
          if (key === "landing") {
            return (
              <section key="landing" className="snap-start">
                <HeroSection
                  coupleName={event.coupleName}
                  displayDate={displayDate}
                  displayTime={displayTime}
                  backgroundImageUrl={backgroundImageUrl}
                  backgroundColor={backgroundColor}
                  colorPrimary={colorPrimary}
                  colorAccent={colorAccent}
                />
              </section>
            );
          }
          if (key === "jemputan" && !disabled.has("jemputan")) {
            return (
              <section key="jemputan" className="snap-start">
                <JemputanSection
                  fatherBride={event.invitationFatherBride}
                  motherBride={event.invitationMotherBride}
                  fatherGroom={event.invitationFatherGroom}
                  motherGroom={event.invitationMotherGroom}
                  brideName={event.invitationBrideName}
                  groomName={event.invitationGroomName}
                  invitationWording={event.invitationWording}
                  language={event.language}
                  backgroundColor={jemputanBg}
                  colorPrimary={jemputanPrimary}
                  colorSecondary={jemputanSecondary}
                  colorAccent={jemputanAccent}
                  backgroundImageUrl={jemputanBgImage}
                />
              </section>
            );
          }
          if (key === "details") {
            return (
              <section key="details" className="snap-start flex min-h-screen flex-col items-center justify-center">
                <EventDetailsSection
                  displayDate={displayDate}
                  displayTime={displayTime}
                  venueName={event.venueName}
                  venueAddress={event.venueAddress}
                  backgroundColor={eventDetailsBg}
                  colorPrimary={eventDetailsPrimary}
                  colorAccent={eventDetailsAccent}
                  backgroundImageUrl={eventDetailsBgImage}
                />
              </section>
            );
          }
          if (key === "photos" && !disabled.has("photos") && carouselImages.length > 0) {
            return (
              <section key="photos" className="snap-start">
                <CarouselSection
                  images={carouselImages}
                  backgroundColor={backgroundColor}
                  colorAccent={colorAccent}
                />
              </section>
            );
          }
          if (key === "wishes" && !disabled.has("wishes")) {
            return (
              <section key="wishes" className="snap-start">
                <WishesTickerSection
                  eventId={event._id}
                  backgroundColor={wishesBg}
                  colorPrimary={wishesPrimary}
                  colorSecondary={wishesSecondary}
                  colorAccent={wishesAccent}
                  backgroundImageUrl={wishesBgImage}
                />
              </section>
            );
          }
          return null;
        })}

        {/* Bottom padding to clear fixed navbar + wish button */}
        <div className="h-24" />
      </div>

      <WishInputModal
        eventId={event._id}
        colorAccent={colorAccent}
        backgroundColor={backgroundColor}
        colorPrimary={colorPrimary}
      />

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
