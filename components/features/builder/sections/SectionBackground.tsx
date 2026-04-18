"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useEditorStore, type EditorField } from "@/stores/editorStore";
import { isValidHex } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export type ImageUrlField = Extract<EditorField, "backgroundImageUrl" | "eventDetailsBgImageUrl" | "wishesBgImageUrl" | "jemputanBgImageUrl">;
export type ImageIdMutationArg = "backgroundImageId" | "eventDetailsBgImageId" | "wishesBgImageId" | "jemputanBgImageId";
export type ClearMutationArg = "clearBackgroundImage" | "clearEventDetailsBgImage" | "clearWishesBgImage" | "clearJemputanBgImage";
export type ColorBgField = Extract<EditorField, "backgroundColor" | "eventDetailsBgColor" | "wishesBgColor" | "jemputanBgColor">;

interface SectionBackgroundProps {
  imageUrlField: ImageUrlField;
  imageIdMutationArg: ImageIdMutationArg;
  clearMutationArg: ClearMutationArg;
  colorField?: ColorBgField;
  sectionTitle: string;
}

export function SectionBackground({
  imageUrlField,
  imageIdMutationArg,
  clearMutationArg,
  colorField,
  sectionTitle,
}: SectionBackgroundProps) {
  const { t } = useTranslation();
  const eventId = useEditorStore((s) => s.eventId);
  const imageUrl = useEditorStore((s) => s[imageUrlField] as string | null);
  const color = useEditorStore((s) => colorField ? (s[colorField] as string) : "");
  const setField = useEditorStore((s) => s.setField);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateEvent = useMutation(api.events.updateEvent);

  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedStorageId, setUploadedStorageId] = useState<Id<"_storage"> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedUrl = useQuery(
    api.storage.getStorageUrl,
    uploadedStorageId ? { storageId: uploadedStorageId } : "skip"
  );

  useEffect(() => {
    if (resolvedUrl) {
      setField(imageUrlField, resolvedUrl);
      setUploadedStorageId(null);
    }
  }, [resolvedUrl, setField, imageUrlField]);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ACCEPTED_TYPES.includes(file.type)) return t("builder.error_image_format");
      if (file.size > MAX_SIZE_BYTES) return t("builder.error_image_size");
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
      setField(imageUrlField, objectUrl);
      try {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!res.ok) throw new Error("Upload failed");
        const { storageId } = (await res.json()) as { storageId: string };
        const sid = storageId as Id<"_storage">;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateEvent({ eventId, [imageIdMutationArg]: sid } as any);
        setUploadedStorageId(sid);
        URL.revokeObjectURL(objectUrl);
      } catch {
        setError(t("builder.save_status_error"));
        setField(imageUrlField, null);
        URL.revokeObjectURL(objectUrl);
      } finally {
        setUploading(false);
      }
    },
    [eventId, generateUploadUrl, updateEvent, setField, validateFile, imageUrlField, imageIdMutationArg, t]
  );

  const handleRemoveImage = useCallback(() => {
    if (!eventId) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateEvent({ eventId, [clearMutationArg]: true } as any);
    setField(imageUrlField, null);
    setUploadedStorageId(null);
  }, [eventId, updateEvent, setField, imageUrlField, clearMutationArg]);

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

  const displayUrl = resolvedUrl ?? imageUrl;

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{sectionTitle}</h3>

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
          {displayUrl ? (
            <>
              {displayUrl.startsWith("blob:") ? (
                /* eslint-disable-next-line @next/next/no-img-element -- blob: URLs not supported by next/image */
                <img
                  src={displayUrl}
                  alt="Background"
                  className="absolute inset-0 h-full w-full rounded-lg object-cover"
                />
              ) : (
                <Image
                  src={displayUrl}
                  alt="Background"
                  fill
                  className="rounded-lg object-cover"
                  sizes="400px"
                />
              )}
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
        <p className="text-xs text-gray-400">{t("builder.image_resolution_hint")}</p>
      </div>

      {colorField && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">{t("builder.background_color")}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setField(colorField, e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300"
            />
            <Input
              value={color}
              onChange={(e) => setField(colorField, e.target.value)}
              placeholder="#f8f4f0"
              className={`flex-1 font-mono text-sm ${color.trim() !== "" && !isValidHex(color) ? "border-red-500" : ""}`}
            />
          </div>
          {color.trim() !== "" && !isValidHex(color) && (
            <p className="text-xs text-red-600">{t("builder.error_hex_color")}</p>
          )}
        </div>
      )}
    </section>
  );
}
