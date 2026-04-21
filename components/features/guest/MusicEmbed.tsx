"use client";

import { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Music } from "lucide-react";
import { extractYouTubeVideoId } from "@/lib/utils/youtube";

interface MusicEmbedProps {
  musicYoutubeUrl: string | undefined;
}

export function MusicEmbed({ musicYoutubeUrl }: MusicEmbedProps) {
  const { t } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = musicYoutubeUrl ? extractYouTubeVideoId(musicYoutubeUrl) : null;

  const handlePlay = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow || !videoId) return;
    iframe.contentWindow.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      "*"
    );
  }, [videoId]);

  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&modestbranding=1&enablejsapi=1`;

  return (
    <>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={t("guest.wedding_music")}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="fixed bottom-4 right-4 z-50 h-0 w-0 border-0 opacity-0"
      />
      <button
        type="button"
        onClick={handlePlay}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-opacity hover:bg-white"
        aria-label={t("guest.play_music")}
      >
        <Music className="h-6 w-6 text-gray-700" />
      </button>
    </>
  );
}
