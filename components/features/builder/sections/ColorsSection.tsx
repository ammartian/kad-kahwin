"use client";

import { useTranslation } from "react-i18next";
import { useEditorStore } from "@/stores/editorStore";
import { Input } from "@/components/ui/input";
import { isValidHex } from "@/lib/utils";

export function ColorsSection() {
  const { t } = useTranslation();
  const colorPrimary = useEditorStore((s) => s.colorPrimary);
  const colorSecondary = useEditorStore((s) => s.colorSecondary);
  const colorAccent = useEditorStore((s) => s.colorAccent);
  const setField = useEditorStore((s) => s.setField);

  const primaryInvalid = colorPrimary.trim() !== "" && !isValidHex(colorPrimary);
  const secondaryInvalid = colorSecondary.trim() !== "" && !isValidHex(colorSecondary);
  const accentInvalid = colorAccent.trim() !== "" && !isValidHex(colorAccent);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{t("builder.colors")}</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.color_primary")}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colorPrimary}
              onChange={(e) => setField("colorPrimary", e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300"
            />
            <Input
              value={colorPrimary}
              onChange={(e) => setField("colorPrimary", e.target.value)}
              className={`flex-1 font-mono text-sm ${primaryInvalid ? "border-red-500" : ""}`}
            />
          </div>
          {primaryInvalid && (
            <p className="text-xs text-red-600">{t("builder.error_hex_color")}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.color_secondary")}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colorSecondary}
              onChange={(e) => setField("colorSecondary", e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300"
            />
            <Input
              value={colorSecondary}
              onChange={(e) => setField("colorSecondary", e.target.value)}
              className={`flex-1 font-mono text-sm ${secondaryInvalid ? "border-red-500" : ""}`}
            />
          </div>
          {secondaryInvalid && (
            <p className="text-xs text-red-600">{t("builder.error_hex_color")}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.color_accent")}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colorAccent}
              onChange={(e) => setField("colorAccent", e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300"
            />
            <Input
              value={colorAccent}
              onChange={(e) => setField("colorAccent", e.target.value)}
              className={`flex-1 font-mono text-sm ${accentInvalid ? "border-red-500" : ""}`}
            />
          </div>
          {accentInvalid && (
            <p className="text-xs text-red-600">{t("builder.error_hex_color")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
