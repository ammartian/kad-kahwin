"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEditorStore } from "@/stores/editorStore";
import { isValidHex } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function BackgroundSection() {
  const { t } = useTranslation();
  const eventId = useEditorStore((s) => s.eventId);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const backgroundImageUrl = useEditorStore((s) => s.backgroundImageUrl);
  const setField = useEditorStore((s) => s.setField);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateEvent = useMutation(api.events.updateEvent);

  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return t("builder.error_image_format");
      }
      if (file.size > MAX_SIZE_BYTES) {
        return t("builder.error_image_size");
      }
      return null;
    },
    [t]
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (!eventId) return;
      const err = validateFile(file);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setUploading(true);
      const objectUrl = URL.createObjectURL(file);
      setField("backgroundImageUrl", objectUrl);
      try {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!res.ok) throw new Error("Upload failed");
        const { storageId } = (await res.json()) as { storageId: string };
        const result = await updateEvent({
          eventId,
          backgroundImageId: storageId as Parameters<typeof updateEvent>[0]["backgroundImageId"],
        });
        if (result?.backgroundImageUrl) {
          setField("backgroundImageUrl", result.backgroundImageUrl);
        }
        URL.revokeObjectURL(objectUrl);
      } catch {
        setError(t("builder.save_status_error"));
        setField("backgroundImageUrl", null);
        URL.revokeObjectURL(objectUrl);
      } finally {
        setUploading(false);
      }
    },
    [eventId, generateUploadUrl, updateEvent, setField, validateFile, t]
  );

  const handleRemoveImage = useCallback(() => {
    if (!eventId) return;
    updateEvent({ eventId, clearBackgroundImage: true });
    setField("backgroundImageUrl", null);
  }, [eventId, updateEvent, setField]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{t("builder.background")}</h3>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">{t("builder.background_image")}</label>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`
            relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors
            ${dragOver ? "border-gray-900 bg-gray-50" : "border-gray-300 bg-gray-50/50 hover:border-gray-400"}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="sr-only"
            onChange={onInputChange}
            disabled={uploading}
          />
          {backgroundImageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs (local preview) not supported by next/image */}
              <img
                src={backgroundImageUrl}
                alt="Background"
                className="absolute inset-0 h-full w-full rounded-lg object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="border-white/50 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          ) : uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-gray-400" />
              <p className="mt-1 text-xs text-gray-500">{t("builder.background_image_hint")}</p>
            </>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">{t("builder.background_color")}</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setField("backgroundColor", e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border border-gray-300"
          />
          <Input
            value={backgroundColor}
            onChange={(e) => setField("backgroundColor", e.target.value)}
            placeholder="#f8f4f0"
            className={`flex-1 font-mono text-sm ${backgroundColor.trim() !== "" && !isValidHex(backgroundColor) ? "border-red-500" : ""}`}
          />
        </div>
        {backgroundColor.trim() !== "" && !isValidHex(backgroundColor) && (
          <p className="text-xs text-red-600">{t("builder.error_hex_color")}</p>
        )}
      </div>
    </section>
  );
}
