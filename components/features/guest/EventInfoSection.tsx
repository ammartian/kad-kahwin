"use client";

import { useTranslation } from "react-i18next";
import { MapPin, Clock, Calendar } from "lucide-react";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EventInfoSectionProps {
  weddingDate: string;
  weddingTime?: string;
  locationWaze?: string;
  locationGoogle?: string;
  locationApple?: string;
  colorAccent?: string;
}

export function EventInfoSection({
  weddingDate,
  weddingTime,
  locationWaze,
  locationGoogle,
  locationApple,
  colorAccent = "#c9a86c",
}: EventInfoSectionProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-MY" : "ms-MY";
  const displayDate = formatEventDate(weddingDate, locale);
  const displayTime = formatEventTime(weddingTime);

  const hasLocation =
    (locationWaze?.trim() && locationWaze.startsWith("http")) ||
    (locationGoogle?.trim() && locationGoogle.startsWith("http")) ||
    (locationApple?.trim() && locationApple.startsWith("http"));

  if (!displayDate && !displayTime && !hasLocation) return null;

  return (
    <section className="flex flex-col gap-4 px-6 py-4">
      {(displayDate || displayTime) && (
        <div className="flex flex-col gap-2">
          {displayDate && (
            <div className="flex items-center gap-2">
              <Calendar
                className="h-5 w-5 shrink-0"
                style={{ color: colorAccent }}
              />
              <span className="text-sm font-medium">{displayDate}</span>
            </div>
          )}
          {displayTime && (
            <div className="flex items-center gap-2">
              <Clock
                className="h-5 w-5 shrink-0"
                style={{ color: colorAccent }}
              />
              <span className="text-sm font-medium">{displayTime}</span>
            </div>
          )}
        </div>
      )}

      {hasLocation && (
        <div className="flex flex-wrap gap-2">
          {locationWaze?.trim() && locationWaze.startsWith("http") && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2"
            >
              <a
                href={locationWaze}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4" />
                {t("guest.open_in_waze")}
              </a>
            </Button>
          )}
          {locationGoogle?.trim() && locationGoogle.startsWith("http") && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2"
            >
              <a
                href={locationGoogle}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4" />
                {t("guest.open_in_google_maps")}
              </a>
            </Button>
          )}
          {locationApple?.trim() && locationApple.startsWith("http") && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2"
            >
              <a
                href={locationApple}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4" />
                {t("guest.open_in_apple_maps")}
              </a>
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
