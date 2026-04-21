"use client";

import { useTranslation } from "react-i18next";
import { CalendarDays, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateIcsContent,
  downloadIcsFile,
  buildGoogleCalendarUrl,
} from "@/lib/utils/generateIcs";

interface CalendarModalProps {
  coupleName: string;
  weddingDate: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  colorAccent: string;
}

export function CalendarModal({
  coupleName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
  colorAccent,
}: CalendarModalProps) {
  const { t } = useTranslation();

  const title = `${coupleName} Wedding`;

  const handleGoogleCalendar = () => {
    const url = buildGoogleCalendarUrl({
      title,
      startDate: weddingDate,
      startTime: weddingTime,
      venueName,
      venueAddress,
      description: `Majlis perkahwinan ${coupleName}`,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleIcsDownload = () => {
    const content = generateIcsContent({
      title,
      startDate: weddingDate,
      startTime: weddingTime,
      venueName,
      venueAddress,
      description: `Majlis perkahwinan ${coupleName}`,
    });
    downloadIcsFile(content, `${coupleName.replace(/\s+/g, "-").toLowerCase()}-wedding.ics`);
  };

  return (
    <div className="px-6 pb-8 pt-4">
      <h2 className="mb-2 text-center text-lg font-semibold">{t("calendar.title")}</h2>

      {/* Event info */}
      <div className="mb-6 rounded-xl bg-gray-50 p-4">
        <div className="mb-1 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0" style={{ color: colorAccent }} />
          <p className="font-semibold">{title}</p>
        </div>
        {venueName && <p className="pl-6 text-sm text-gray-500">{venueName}</p>}
        {venueAddress && <p className="pl-6 text-sm text-gray-500">{venueAddress}</p>}
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleGoogleCalendar}
          className="w-full justify-start gap-3 text-white"
          style={{ backgroundColor: "#4285f4" }}
        >
          <ExternalLink className="h-4 w-4" />
          {t("calendar.add_google")}
        </Button>
        <Button
          type="button"
          onClick={handleIcsDownload}
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <Download className="h-4 w-4" />
          {t("calendar.add_apple")}
        </Button>
        <Button
          type="button"
          onClick={handleIcsDownload}
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <Download className="h-4 w-4" />
          {t("calendar.add_outlook")}
        </Button>
      </div>
    </div>
  );
}
