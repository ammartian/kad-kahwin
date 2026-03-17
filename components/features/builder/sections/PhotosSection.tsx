"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useEditorStore } from "@/stores/editorStore";
import Image from "next/image";
import { ImagePlus, Loader2, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_PHOTOS = 10;

interface UploadingItem {
  tempId: string;
  previewUrl: string;
}

interface PhotosSectionProps {
  eventId: Id<"events">;
  carouselImageIds: Id<"_storage">[];
  onIdsChange: (ids: Id<"_storage">[]) => void;
}

function PhotosSection({ eventId, carouselImageIds, onIdsChange }: PhotosSectionProps) {
  const { t } = useTranslation();
  const carouselImageUrls = useEditorStore((s) => s.carouselImageUrls);
  const setField = useEditorStore((s) => s.setField);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateCarouselImages = useMutation(api.guest.updateCarouselImages);

  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragSrcIdx = useRef<number | null>(null);

  const currentCount = carouselImageIds.length + uploading.length;

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) return t("builder.error_image_format");
    if (file.size > MAX_SIZE_BYTES) return t("builder.error_image_size");
    return null;
  };

  const handleFiles = useCallback(
    async (files: File[]) => {
      setError(null);
      const available = MAX_PHOTOS - currentCount;
      const toProcess = files.slice(0, available);
      if (toProcess.length === 0) {
        setError(t("builder.photos_max_reached"));
        return;
      }

      const newUploading: UploadingItem[] = toProcess.map((f) => ({
        tempId: `${Date.now()}-${f.name}`,
        previewUrl: URL.createObjectURL(f),
      }));
      setUploading((prev) => [...prev, ...newUploading]);

      const newIds: Id<"_storage">[] = [];
      for (let i = 0; i < toProcess.length; i++) {
        const file = toProcess[i];
        const err = validateFile(file);
        if (err) {
          setError(err);
          URL.revokeObjectURL(newUploading[i].previewUrl);
          continue;
        }
        try {
          const uploadUrl = await generateUploadUrl();
          const res = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          if (!res.ok) throw new Error("Upload failed");
          const { storageId } = (await res.json()) as { storageId: string };
          newIds.push(storageId as Id<"_storage">);
        } catch {
          setError(t("builder.save_status_error"));
        } finally {
          URL.revokeObjectURL(newUploading[i].previewUrl);
          setUploading((prev) => prev.filter((u) => u.tempId !== newUploading[i].tempId));
        }
      }

      if (newIds.length > 0) {
        const updatedIds = [...carouselImageIds, ...newIds];
        onIdsChange(updatedIds);
        await updateCarouselImages({ eventId, imageIds: updatedIds });
        // Refresh preview URLs (simplified: trigger a re-read via store)
        // The store carouselImageUrls will update via getEvent re-fetch
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCount, carouselImageIds, eventId, generateUploadUrl, updateCarouselImages, t]
  );

  const removePhoto = useCallback(
    async (index: number) => {
      const newIds = carouselImageIds.filter((_, i) => i !== index);
      const newUrls = carouselImageUrls.filter((_, i) => i !== index);
      onIdsChange(newIds);
      setField("carouselImageUrls", newUrls);
      await updateCarouselImages({ eventId, imageIds: newIds });
    },
    [carouselImageIds, carouselImageUrls, eventId, updateCarouselImages, setField, onIdsChange]
  );

  const onDragStart = (idx: number) => {
    dragSrcIdx.current = idx;
  };

  const onDrop = useCallback(
    async (targetIdx: number) => {
      const srcIdx = dragSrcIdx.current;
      if (srcIdx === null || srcIdx === targetIdx) {
        setDragOverIdx(null);
        return;
      }
      const newIds = [...carouselImageIds];
      const newUrls = [...carouselImageUrls];
      const [removedId] = newIds.splice(srcIdx, 1);
      const [removedUrl] = newUrls.splice(srcIdx, 1);
      newIds.splice(targetIdx, 0, removedId);
      newUrls.splice(targetIdx, 0, removedUrl);
      onIdsChange(newIds);
      setField("carouselImageUrls", newUrls);
      setDragOverIdx(null);
      dragSrcIdx.current = null;
      await updateCarouselImages({ eventId, imageIds: newIds });
    },
    [carouselImageIds, carouselImageUrls, eventId, updateCarouselImages, setField, onIdsChange]
  );

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{t("builder.photos")}</h3>
      <p className="text-xs text-gray-500">{t("builder.photos_hint")}</p>

      {/* Photo grid */}
      {carouselImageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {carouselImageUrls.map((url, i) => (
            <div
              key={url}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => { e.preventDefault(); setDragOverIdx(i); }}
              onDrop={() => onDrop(i)}
              onDragLeave={() => setDragOverIdx(null)}
              className={`group relative aspect-square cursor-grab overflow-hidden rounded-lg border-2 transition-all active:cursor-grabbing ${
                dragOverIdx === i ? "border-gray-900 opacity-70" : "border-transparent"
              }`}
            >
              <Image
                src={url}
                alt={`Photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              {/* Drag handle overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                <GripVertical className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Uploading placeholders */}
          {uploading.map((u) => (
            <div
              key={u.tempId}
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100"
            >
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ))}
        </div>
      )}

      {/* Count + add button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {t("builder.photos_count", { count: carouselImageIds.length })}
        </span>
        {currentCount < MAX_PHOTOS && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading.length > 0}
            className="gap-1.5 text-xs"
          >
            {uploading.length > 0 ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            {t("builder.photos_add")}
          </Button>
        )}
      </div>

      {/* Drop zone when no photos yet */}
      {carouselImageUrls.length === 0 && uploading.length === 0 && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 transition-colors hover:border-gray-400"
        >
          <ImagePlus className="h-7 w-7 text-gray-400" />
          <p className="mt-1 text-xs text-gray-500">{t("builder.photos_hint")}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) handleFiles(files);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </section>
  );
}

export { PhotosSection };
