"use client";

import { useTranslation } from "react-i18next";
import { useEditorStore } from "@/stores/editorStore";
import { Input } from "@/components/ui/input";

const YOUTUBE_PATTERN =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

export function MusicSection() {
  const { t } = useTranslation();
  const musicYoutubeUrl = useEditorStore((s) => s.musicYoutubeUrl);
  const setField = useEditorStore((s) => s.setField);

  const isValid = !musicYoutubeUrl || YOUTUBE_PATTERN.test(musicYoutubeUrl.trim());

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{t("builder.music")}</h3>
      <div className="space-y-2">
        <Input
          value={musicYoutubeUrl}
          onChange={(e) => setField("musicYoutubeUrl", e.target.value)}
          placeholder={t("builder.music_placeholder")}
          className={!isValid ? "border-red-500" : ""}
        />
        <p className="text-xs text-gray-500">{t("builder.music_hint")}</p>
        {!isValid && (
          <p className="text-xs text-red-600">{t("builder.error_youtube_url")}</p>
        )}
      </div>
    </section>
  );
}
