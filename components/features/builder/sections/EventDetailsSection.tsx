"use client";

import { useTranslation } from "react-i18next";
import { useEditorStore } from "@/stores/editorStore";
import { Input } from "@/components/ui/input";

export function EventDetailsSection() {
  const { t } = useTranslation();
  const coupleName = useEditorStore((s) => s.coupleName);
  const weddingDate = useEditorStore((s) => s.weddingDate);
  const weddingTime = useEditorStore((s) => s.weddingTime);
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
      </div>
    </section>
  );
}
