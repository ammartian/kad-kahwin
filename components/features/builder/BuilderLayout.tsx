"use client";

import { useTranslation } from "react-i18next";
import type { Id } from "@/convex/_generated/dataModel";
import { useAutoSave } from "@/hooks/useAutoSave";
import { EditorPanel } from "./EditorPanel";
import { PreviewPanel } from "./PreviewPanel";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { LanguageToggle } from "@/components/landing/LanguageToggle";

interface BuilderLayoutProps {
  eventId: Id<"events">;
  carouselImageIds: Id<"_storage">[];
  carouselImageUrls: string[];
  onCarouselIdsChange: (ids: Id<"_storage">[]) => void;
  onCarouselUrlsChange: (urls: string[]) => void;
}

export function BuilderLayout({
  eventId,
  carouselImageIds,
  carouselImageUrls,
  onCarouselIdsChange,
  onCarouselUrlsChange,
}: BuilderLayoutProps) {
  const { t } = useTranslation();
  const saveStatus = useAutoSave(eventId);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex shrink-0 items-center justify-end gap-4 border-b border-gray-200 bg-white px-4 py-2 sm:px-6">
        <LanguageToggle />
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("builder.save_status_saving")}</span>
            </>
          )}
          {saveStatus === "idle" && (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">{t("builder.save_status_idle")}</span>
            </>
          )}
          {saveStatus === "error" && (
            <>
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-600">{t("builder.save_status_error")}</span>
            </>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto lg:flex-row">
        <div className="flex min-h-[50vh] flex-1 flex-col overflow-hidden bg-white lg:min-h-0 lg:flex-[6]">
          <EditorPanel
            eventId={eventId}
            carouselImageIds={carouselImageIds}
            carouselImageUrls={carouselImageUrls}
            onCarouselIdsChange={onCarouselIdsChange}
            onCarouselUrlsChange={onCarouselUrlsChange}
          />
        </div>
        <div className="flex min-h-[400px] flex-1 lg:min-h-0 lg:flex-[4]">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
}
