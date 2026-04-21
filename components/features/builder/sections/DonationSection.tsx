"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEditorStore } from "@/stores/editorStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function DonationSection() {
  const { t } = useTranslation();
  const eventId = useEditorStore((s) => s.eventId);
  const event = useQuery(
    api.events.getEvent,
    eventId ? { eventId } : "skip"
  );

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateEvent = useMutation(api.events.updateEvent);

  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankHolder, setBankHolder] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const syncedEventId = useRef<typeof eventId>(null);

  useEffect(() => {
    if (event && eventId && syncedEventId.current !== eventId) {
      syncedEventId.current = eventId;
      setBankName(event.bankName ?? "");
      setBankAccount(event.bankAccount ?? "");
      setBankHolder(event.bankHolder ?? "");
    }
  }, [eventId, event]);

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
      try {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!res.ok) throw new Error("Upload failed");
        const { storageId } = (await res.json()) as { storageId: string };
        await updateEvent({
          eventId,
          donationQrId: storageId as Parameters<typeof updateEvent>[0]["donationQrId"],
        });
      } catch {
        setError(t("builder.save_status_error"));
      } finally {
        setUploading(false);
      }
    },
    [eventId, generateUploadUrl, updateEvent, validateFile, t]
  );

  const handleRemoveQr = useCallback(() => {
    if (!eventId) return;
    updateEvent({ eventId, clearDonationQr: true });
  }, [eventId, updateEvent]);

  const handleSaveBank = useCallback(() => {
    if (!eventId) return;
    updateEvent({
      eventId,
      bankName: bankName.trim() || undefined,
      bankAccount: bankAccount.trim() || undefined,
      bankHolder: bankHolder.trim() || undefined,
    });
  }, [eventId, bankName, bankAccount, bankHolder, updateEvent]);

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

  if (!eventId) return null;

  const donationQrUrl = event?.donationQrUrl ?? null;

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">
        {t("builder.donation")}
      </h3>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">
          {t("builder.donation_qr")}
        </label>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`
            relative flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors
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
          {donationQrUrl ? (
            <>
              <Image
                src={donationQrUrl}
                alt="Donation QR"
                fill
                className="rounded-lg object-contain"
                sizes="200px"
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
                      handleRemoveQr();
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
              <p className="mt-1 text-xs text-gray-500">
                {t("builder.donation_qr_hint")}
              </p>
            </>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">
          {t("builder.bank_name")}
        </label>
        <Input
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          onBlur={handleSaveBank}
          placeholder="e.g. Maybank"
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">
          {t("builder.bank_account")}
        </label>
        <Input
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
          onBlur={handleSaveBank}
          placeholder="e.g. 1234567890"
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">
          {t("builder.bank_holder")}
        </label>
        <Input
          value={bankHolder}
          onChange={(e) => setBankHolder(e.target.value)}
          onBlur={handleSaveBank}
          placeholder="e.g. Ahmad bin Ali"
          className="text-sm"
        />
      </div>
    </section>
  );
}
