"use client";

import { useTranslation } from "react-i18next";
import { SectionBackground } from "./SectionBackground";

export function BackgroundSection() {
  const { t } = useTranslation();
  return (
    <SectionBackground
      imageUrlField="backgroundImageUrl"
      imageIdMutationArg="backgroundImageId"
      clearMutationArg="clearBackgroundImage"
      colorField="backgroundColor"
      sectionTitle={t("builder.background")}
    />
  );
}
