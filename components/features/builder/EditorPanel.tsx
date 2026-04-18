"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, CalendarDays, Images, Layers, Copy, Check } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useInviteUrl } from "@/hooks/useInviteUrl";
import {
  BackgroundSection,
  ColorsSection,
  MusicSection,
  EventDetailsSection,
  LocationSection,
  DonationSection,
  JemputanSection,
} from "./sections";
import { PhotosSection } from "./sections/PhotosSection";
import { SectionBackground } from "./sections/SectionBackground";
import { SectionColors } from "./sections/SectionColors";
import { SectionsManagerSection } from "./sections/SectionsManagerSection";

type TabKey = "landing" | "details" | "photos" | "sections";

interface EditorPanelProps {
  eventId: Id<"events">;
  slug: string;
  carouselImageIds: Id<"_storage">[];
  carouselImageUrls: string[];
  onCarouselIdsChange: (ids: Id<"_storage">[]) => void;
  onCarouselUrlsChange: (urls: string[]) => void;
}

export function EditorPanel({ eventId, slug, carouselImageIds, carouselImageUrls, onCarouselIdsChange, onCarouselUrlsChange }: EditorPanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("landing");
  const [copied, setCopied] = useState(false);
  const inviteUrl = useInviteUrl(slug);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [inviteUrl]);

  const tabs: { key: TabKey; labelKey: string; icon: React.ReactNode }[] = [
    { key: "landing",  labelKey: "builder.tab_landing",   icon: <Sparkles className="h-4 w-4" /> },
    { key: "details",  labelKey: "builder.tab_details",   icon: <CalendarDays className="h-4 w-4" /> },
    { key: "photos",   labelKey: "builder.tab_photos",    icon: <Images className="h-4 w-4" /> },
    { key: "sections", labelKey: "builder.tab_sections",  icon: <Layers className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">{t("builder.title")}</h2>
      </div>

      {/* Invitation URL banner */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2 sm:px-6">
        <span className="min-w-0 flex-1 truncate text-xs text-gray-500">{inviteUrl}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
          aria-label="Copy invitation URL"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? t("event_card.copied") : t("dashboard.copy_link")}
        </button>
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
          {activeTab === "landing" && (
            <>
              <BackgroundSection />
              <ColorsSection />
              <MusicSection />
            </>
          )}
          {activeTab === "details" && (
            <>
              <EventDetailsSection />
              <LocationSection />
              <SectionBackground
                imageUrlField="eventDetailsBgImageUrl"
                imageIdMutationArg="eventDetailsBgImageId"
                clearMutationArg="clearEventDetailsBgImage"
                colorField="eventDetailsBgColor"
                sectionTitle={t("builder.section_event_details_bg")}
              />
              <SectionColors
                primaryField="eventDetailsColorPrimary"
                secondaryField="eventDetailsColorSecondary"
                accentField="eventDetailsColorAccent"
                title={t("builder.section_event_details_colors")}
              />
              <JemputanSection />
              <SectionBackground
                imageUrlField="jemputanBgImageUrl"
                imageIdMutationArg="jemputanBgImageId"
                clearMutationArg="clearJemputanBgImage"
                colorField="jemputanBgColor"
                sectionTitle={t("builder.section_jemputan_bg")}
              />
              <SectionColors
                primaryField="jemputanColorPrimary"
                secondaryField="jemputanColorSecondary"
                accentField="jemputanColorAccent"
                title={t("builder.section_jemputan_colors")}
              />
            </>
          )}
          {activeTab === "sections" && (
            <SectionsManagerSection />
          )}
          {activeTab === "photos" && (
            <>
              <PhotosSection
                eventId={eventId}
                carouselImageIds={carouselImageIds}
                carouselImageUrls={carouselImageUrls}
                onIdsChange={onCarouselIdsChange}
                onUrlsChange={onCarouselUrlsChange}
              />
              <SectionBackground
                imageUrlField="wishesBgImageUrl"
                imageIdMutationArg="wishesBgImageId"
                clearMutationArg="clearWishesBgImage"
                colorField="wishesBgColor"
                sectionTitle={t("builder.section_wishes_bg")}
              />
              <SectionColors
                primaryField="wishesColorPrimary"
                secondaryField="wishesColorSecondary"
                accentField="wishesColorAccent"
                title={t("builder.section_wishes_colors")}
              />
              <DonationSection />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
