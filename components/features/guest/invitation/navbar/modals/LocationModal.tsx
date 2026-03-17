"use client";

import { useTranslation } from "react-i18next";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationModalProps {
  venueName?: string;
  venueAddress?: string;
  locationWaze?: string;
  locationGoogle?: string;
  locationApple?: string;
  colorAccent: string;
}

export function LocationModal({
  venueName,
  venueAddress,
  locationWaze,
  locationGoogle,
  locationApple,
  colorAccent,
}: LocationModalProps) {
  const { t } = useTranslation();

  const hasLocation =
    (locationWaze?.trim() && locationWaze.startsWith("http")) ||
    (locationGoogle?.trim() && locationGoogle.startsWith("http")) ||
    (locationApple?.trim() && locationApple.startsWith("http"));

  return (
    <div className="px-6 pb-8 pt-4">
      <h2 className="mb-6 text-center text-lg font-semibold">{t("location.title")}</h2>

      {/* Venue info */}
      {(venueName || venueAddress) && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: colorAccent }} />
          <div>
            {venueName && <p className="font-semibold">{venueName}</p>}
            {venueAddress && <p className="mt-0.5 text-sm text-gray-500">{venueAddress}</p>}
          </div>
        </div>
      )}

      {!hasLocation ? (
        <p className="text-center text-sm text-gray-400">{t("location.empty")}</p>
      ) : (
        <div className="space-y-3">
          {locationWaze?.trim() && locationWaze.startsWith("http") && (
            <Button
              asChild
              className="w-full justify-start gap-3 text-white"
              style={{ backgroundColor: "#33ccff" }}
            >
              <a href={locationWaze} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4" />
                {t("location.open_waze")}
              </a>
            </Button>
          )}
          {locationGoogle?.trim() && locationGoogle.startsWith("http") && (
            <Button
              asChild
              className="w-full justify-start gap-3 text-white"
              style={{ backgroundColor: "#34a853" }}
            >
              <a href={locationGoogle} target="_blank" rel="noopener noreferrer">
                <MapPin className="h-4 w-4" />
                {t("location.open_google")}
              </a>
            </Button>
          )}
          {locationApple?.trim() && locationApple.startsWith("http") && (
            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <a href={locationApple} target="_blank" rel="noopener noreferrer">
                <MapPin className="h-4 w-4" />
                {t("location.open_apple")}
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
