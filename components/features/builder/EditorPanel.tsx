"use client";

import { useTranslation } from "react-i18next";
import {
  BackgroundSection,
  ColorsSection,
  MusicSection,
  EventDetailsSection,
  LocationSection,
} from "./sections";

export function EditorPanel() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">{t("builder.title")}</h2>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="space-y-6 p-4 sm:p-6">
          <BackgroundSection />
          <ColorsSection />
          <MusicSection />
          <EventDetailsSection />
          <LocationSection />
        </div>
      </div>
    </div>
  );
}
