"use client";

import Image from "next/image";
import { useEditorStore } from "@/stores/editorStore";

const PREVIEW_WIDTH = 375;

export function InvitationPreview() {
  const coupleName = useEditorStore((s) => s.coupleName);
  const weddingDate = useEditorStore((s) => s.weddingDate);
  const weddingTime = useEditorStore((s) => s.weddingTime);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const backgroundImageUrl = useEditorStore((s) => s.backgroundImageUrl);
  const colorPrimary = useEditorStore((s) => s.colorPrimary);
  const colorAccent = useEditorStore((s) => s.colorAccent);
  const venueName = useEditorStore((s) => s.venueName);
  const venueAddress = useEditorStore((s) => s.venueAddress);

  const displayDate = weddingDate
    ? new Date(weddingDate + "T12:00:00").toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const displayTime = weddingTime
    ? new Date(`1970-01-01T${weddingTime}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const isBlobUrl = backgroundImageUrl?.startsWith("blob:");

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
      style={{ width: PREVIEW_WIDTH, aspectRatio: "9/16" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: backgroundColor || "#f8f4f0",
        }}
      />
      {backgroundImageUrl &&
        (isBlobUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob: URLs not supported by next/image
          <img
            src={backgroundImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes={`${PREVIEW_WIDTH}px`}
          />
        ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <div
          className="mb-4 text-2xl font-semibold tracking-wide"
          style={{ color: colorPrimary || "#1a1a1a" }}
        >
          {coupleName || "Nama Pasangan"}
        </div>
        {displayDate && (
          <div
            className="text-sm font-medium"
            style={{ color: colorAccent || "#c9a86c" }}
          >
            {displayDate}
          </div>
        )}
        {displayTime && (
          <div
            className="mt-1 text-sm"
            style={{ color: colorAccent || "#c9a86c" }}
          >
            {displayTime}
          </div>
        )}
        {venueName && (
          <div
            className="mt-3 text-xs font-medium"
            style={{ color: colorPrimary || "#1a1a1a" }}
          >
            {venueName}
          </div>
        )}
        {venueAddress && (
          <div
            className="mt-0.5 text-xs opacity-70"
            style={{ color: colorPrimary || "#1a1a1a" }}
          >
            {venueAddress}
          </div>
        )}
      </div>
    </div>
  );
}
