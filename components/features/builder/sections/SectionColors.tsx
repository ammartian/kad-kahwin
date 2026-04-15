"use client";

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { useEditorStore, type EditorField } from "@/stores/editorStore";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isValidHex } from "@/lib/utils";

const HexColorPicker = dynamic(
  () => import("react-colorful").then((m) => ({ default: m.HexColorPicker })),
  { ssr: false }
);

export type SectionColorField = Extract<
  EditorField,
  | "colorPrimary"
  | "colorSecondary"
  | "colorAccent"
  | "eventDetailsColorPrimary"
  | "eventDetailsColorSecondary"
  | "eventDetailsColorAccent"
  | "wishesColorPrimary"
  | "wishesColorSecondary"
  | "wishesColorAccent"
>;

interface ColorPickerFieldProps {
  field: SectionColorField;
  label: string;
  hint: string;
}

function ColorPickerField({ field, label, hint }: ColorPickerFieldProps) {
  const value = useEditorStore((s) => s[field] as string);
  const setField = useEditorStore((s) => s.setField);
  const invalid = value.trim() !== "" && !isValidHex(value);
  const displayColor = value && isValidHex(value) ? value : "#1a1a1a";

  return (
    <div className="space-y-1.5">
      <div>
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <p className="text-[11px] text-gray-400 leading-tight">{hint}</p>
      </div>
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

interface SectionColorsProps {
  primaryField: SectionColorField;
  secondaryField: SectionColorField;
  accentField: SectionColorField;
  title: string;
}

export function SectionColors({ primaryField, secondaryField, accentField, title }: SectionColorsProps) {
  const { t } = useTranslation();
  const primaryValue = useEditorStore((s) => s[primaryField] as string);
  const secondaryValue = useEditorStore((s) => s[secondaryField] as string);
  const accentValue = useEditorStore((s) => s[accentField] as string);

  const anyInvalid =
    (primaryValue.trim() !== "" && !isValidHex(primaryValue)) ||
    (secondaryValue.trim() !== "" && !isValidHex(secondaryValue)) ||
    (accentValue.trim() !== "" && !isValidHex(accentValue));

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <ColorPickerField
          field={primaryField}
          label={t("builder.color_primary")}
          hint={t("builder.color_primary_hint")}
        />
        <ColorPickerField
          field={secondaryField}
          label={t("builder.color_secondary")}
          hint={t("builder.color_secondary_hint")}
        />
        <ColorPickerField
          field={accentField}
          label={t("builder.color_accent")}
          hint={t("builder.color_accent_hint")}
        />
      </div>
      {anyInvalid && (
        <p className="text-xs text-red-600">{t("builder.error_hex_color")}</p>
      )}
    </section>
  );
}
