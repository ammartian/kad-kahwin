"use client";

import { useTranslation } from "react-i18next";
import { HexColorPicker } from "react-colorful";
import { useEditorStore } from "@/stores/editorStore";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isValidHex } from "@/lib/utils";

type ColorField = "colorPrimary" | "colorSecondary" | "colorAccent";

interface ColorPickerFieldProps {
  field: ColorField;
  label: string;
  value: string;
  invalid: boolean;
}

function ColorPickerField({ field, label, value, invalid }: ColorPickerFieldProps) {
  const setField = useEditorStore((s) => s.setField);
  const displayColor = value && isValidHex(value) ? value : "#1a1a1a";

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-10 w-14 shrink-0 cursor-pointer rounded border border-gray-300 transition-opacity hover:opacity-90"
              style={{ backgroundColor: displayColor }}
              aria-label={label}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <HexColorPicker
              color={displayColor}
              onChange={(hex) => setField(field, hex)}
              style={{ width: "200px" }}
            />
          </PopoverContent>
        </Popover>
        <Input
          value={value}
          onChange={(e) => setField(field, e.target.value)}
          className={`flex-1 font-mono text-sm ${invalid ? "border-red-500" : ""}`}
        />
      </div>
    </div>
  );
}

export function ColorsSection() {
  const { t } = useTranslation();
  const colorPrimary = useEditorStore((s) => s.colorPrimary);
  const colorSecondary = useEditorStore((s) => s.colorSecondary);
  const colorAccent = useEditorStore((s) => s.colorAccent);

  const primaryInvalid = colorPrimary.trim() !== "" && !isValidHex(colorPrimary);
  const secondaryInvalid = colorSecondary.trim() !== "" && !isValidHex(colorSecondary);
  const accentInvalid = colorAccent.trim() !== "" && !isValidHex(colorAccent);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{t("builder.colors")}</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <ColorPickerField
          field="colorPrimary"
          label={t("builder.color_primary")}
          value={colorPrimary}
          invalid={primaryInvalid}
        />
        <ColorPickerField
          field="colorSecondary"
          label={t("builder.color_secondary")}
          value={colorSecondary}
          invalid={secondaryInvalid}
        />
        <ColorPickerField
          field="colorAccent"
          label={t("builder.color_accent")}
          value={colorAccent}
          invalid={accentInvalid}
        />
      </div>
      {(primaryInvalid || secondaryInvalid || accentInvalid) && (
        <p className="text-xs text-red-600">{t("builder.error_hex_color")}</p>
      )}
    </section>
  );
}
