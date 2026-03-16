"use client";

import { useTranslation } from "react-i18next";
import { useEditorStore } from "@/stores/editorStore";
import { Input } from "@/components/ui/input";

export function LocationSection() {
  const { t } = useTranslation();
  const locationWaze = useEditorStore((s) => s.locationWaze);
  const locationGoogle = useEditorStore((s) => s.locationGoogle);
  const locationApple = useEditorStore((s) => s.locationApple);
  const setField = useEditorStore((s) => s.setField);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{t("builder.location")}</h3>
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.location_waze")}</label>
          <Input
            type="url"
            value={locationWaze}
            onChange={(e) => setField("locationWaze", e.target.value)}
            placeholder={t("builder.location_placeholder")}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.location_google")}</label>
          <Input
            type="url"
            value={locationGoogle}
            onChange={(e) => setField("locationGoogle", e.target.value)}
            placeholder={t("builder.location_placeholder")}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.location_apple")}</label>
          <Input
            type="url"
            value={locationApple}
            onChange={(e) => setField("locationApple", e.target.value)}
            placeholder={t("builder.location_placeholder")}
          />
        </div>
      </div>
    </section>
  );
}
