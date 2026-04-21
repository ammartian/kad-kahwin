"use client";

import { useTranslation } from "react-i18next";
import { SectionColors } from "./SectionColors";

export function ColorsSection() {
  const { t } = useTranslation();
  return (
    <SectionColors
      primaryField="colorPrimary"
      secondaryField="colorSecondary"
      accentField="colorAccent"
      title={t("builder.colors")}
    />
  );
}
