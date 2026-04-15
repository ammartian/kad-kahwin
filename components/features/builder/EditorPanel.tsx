"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Palette, Image as ImageIcon, Gift } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  BackgroundSection,
  ColorsSection,
  MusicSection,
  EventDetailsSection,
  LocationSection,
  DonationSection,
} from "./sections";
import { PhotosSection } from "./sections/PhotosSection";

type TabKey = "details" | "design" | "media" | "extras";

interface EditorPanelProps {
  eventId: Id<"events">;
  carouselImageIds: Id<"_storage">[];
  carouselImageUrls: string[];
  onCarouselIdsChange: (ids: Id<"_storage">[]) => void;
  onCarouselUrlsChange: (urls: string[]) => void;
}

export function EditorPanel({ eventId, carouselImageIds, carouselImageUrls, onCarouselIdsChange, onCarouselUrlsChange }: EditorPanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("details");

  const tabs: { key: TabKey; labelKey: string; icon: React.ReactNode }[] = [
    { key: "details", labelKey: "builder.tab_details", icon: <Calendar className="h-4 w-4" /> },
    { key: "design",  labelKey: "builder.tab_design",  icon: <Palette className="h-4 w-4" /> },
    { key: "media",   labelKey: "builder.tab_media",   icon: <ImageIcon className="h-4 w-4" /> },
    { key: "extras",  labelKey: "builder.tab_extras",  icon: <Gift className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">{t("builder.title")}</h2>
      </div>

      {/* Tab strip */}
      <div className="flex shrink-0 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors",
              activeTab === tab.key
                ? "border-b-2 border-gray-900 text-gray-900"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.icon}
            <span>{t(tab.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="space-y-6 p-4 sm:p-6">
          {activeTab === "details" && (
            <>
              <EventDetailsSection />
              <LocationSection />
            </>
          )}
          {activeTab === "design" && (
            <>
              <BackgroundSection />
              <ColorsSection />
            </>
          )}
          {activeTab === "media" && (
            <>
              <PhotosSection
                eventId={eventId}
                carouselImageIds={carouselImageIds}
                carouselImageUrls={carouselImageUrls}
                onIdsChange={onCarouselIdsChange}
                onUrlsChange={onCarouselUrlsChange}
              />
              <MusicSection />
            </>
          )}
          {activeTab === "extras" && (
            <DonationSection />
          )}
        </div>
      </div>
    </div>
  );
}
