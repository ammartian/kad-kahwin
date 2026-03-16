"use client";

import { useTranslation } from "react-i18next";

export default function EventSettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-muted-foreground">{t("dashboard.coming_soon")}</p>
      </div>
    </div>
  );
}
