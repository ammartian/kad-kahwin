"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import { EventInfoSection } from "./EventInfoSection";
import { MusicEmbed } from "./MusicEmbed";

const PREVIEW_WIDTH = 375;

interface GuestInvitationPageProps {
  slug: string;
}

export function GuestInvitationPage({ slug }: GuestInvitationPageProps) {
  const { t, i18n } = useTranslation();
  const event = useQuery(api.guest.getEventBySlug, { slug });

  useEffect(() => {
    if (event?.language) {
      i18n.changeLanguage(event.language);
    }
  }, [event?.language, i18n]);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className="mx-auto flex min-h-screen flex-col overflow-auto"
        style={{ maxWidth: PREVIEW_WIDTH }}
      >
        <div className="relative flex min-h-screen flex-1 flex-col">
          <div
            className="absolute inset-0"
            style={{ backgroundColor }}
          />
          {backgroundImageUrl && (
            <Image
              src={backgroundImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes={`${PREVIEW_WIDTH}px`}
              priority
            />
          )}
          <div className="relative flex flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <h1
                className="mb-4 text-2xl font-semibold tracking-wide"
                style={{ color: colorPrimary }}
              >
                {event.coupleName || t("guest.couple_name_placeholder")}
              </h1>
              {displayDate && (
                <div
                  className="text-sm font-medium"
                  style={{ color: colorAccent }}
                >
                  {displayDate}
                </div>
              )}
              {displayTime && (
                <div
                  className="mt-1 text-sm"
                  style={{ color: colorAccent }}
                >
                  {displayTime}
                </div>
              )}
            </div>
            <EventInfoSection
              weddingDate={event.weddingDate}
              weddingTime={event.weddingTime}
              locationWaze={event.locationWaze}
              locationGoogle={event.locationGoogle}
              locationApple={event.locationApple}
              colorAccent={colorAccent}
            />
          </div>
        </div>
      </div>
      <MusicEmbed musicYoutubeUrl={event.musicYoutubeUrl} />
    </div>
  );
}
