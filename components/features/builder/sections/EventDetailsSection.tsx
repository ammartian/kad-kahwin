"use client";

import { useTranslation } from "react-i18next";
import { useEditorStore } from "@/stores/editorStore";
import { Input } from "@/components/ui/input";

export function EventDetailsSection() {
  const { t } = useTranslation();
  const coupleName = useEditorStore((s) => s.coupleName);
  const weddingDate = useEditorStore((s) => s.weddingDate);
  const weddingTime = useEditorStore((s) => s.weddingTime);
  const venueName = useEditorStore((s) => s.venueName);
  const venueAddress = useEditorStore((s) => s.venueAddress);
  const setField = useEditorStore((s) => s.setField);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{t("builder.event_details")}</h3>
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.couple_name")}</label>
          <Input
            value={coupleName}
            onChange={(e) => setField("coupleName", e.target.value)}
            placeholder={t("builder.couple_name_placeholder")}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.wedding_date")}</label>
          <Input
            type="date"
            value={weddingDate}
            onChange={(e) => setField("weddingDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.wedding_time")}</label>
          <Input
            type="time"
            value={weddingTime}
            onChange={(e) => setField("weddingTime", e.target.value)}
            placeholder={t("builder.wedding_time_placeholder")}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.venue_name")}</label>
          <Input
            value={venueName}
            onChange={(e) => setField("venueName", e.target.value)}
            placeholder={t("builder.venue_name_placeholder")}
            maxLength={200}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.venue_address")}</label>
          <textarea
            value={venueAddress}
            onChange={(e) => setField("venueAddress", e.target.value)}
            placeholder={t("builder.venue_address_placeholder")}
            maxLength={500}
            rows={2}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>
    </section>
  );
}
