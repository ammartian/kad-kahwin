"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useTranslation } from "react-i18next";
import { MessageCircleHeart } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MAX_NAME = 100;
const MAX_MESSAGE = 255;

interface WishInputModalProps {
  eventId: Id<"events">;
  colorAccent: string;
  backgroundColor: string;
  colorPrimary: string;
}

export function WishInputModal({
  eventId,
  colorAccent,
  backgroundColor,
  colorPrimary,
}: WishInputModalProps) {
  const { t } = useTranslation();
  const addWish = useMutation(api.wishes.addWish);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleOpen() {
    setOpen(true);
    setError(null);
    setSuccess(false);
  }

  function handleClose() {
    setOpen(false);
    setName("");
    setMessage("");
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await addWish({ eventId, guestName: name.trim(), message: message.trim() });
      setSuccess(true);
      setTimeout(() => handleClose(), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Fixed floating button — sits above BottomNavbar (h-16 = 64px) */}
      <button
        type="button"
        onClick={handleOpen}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition-transform active:scale-95"
        style={{ backgroundColor: colorAccent, color: backgroundColor }}
        aria-label={t("wishes.write_button")}
      >
        <MessageCircleHeart className="h-4 w-4" />
        {t("wishes.write_button")}
      </button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("wishes.modal_title")}</DialogTitle>
          </DialogHeader>

          {success ? (
            <p className="py-4 text-center text-sm text-green-600">
              {t("wishes.success_message")}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  {t("wishes.name_label")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
                  placeholder={t("wishes.name_placeholder")}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  maxLength={MAX_NAME}
                  required
                  disabled={submitting}
                />
                <span className="self-end text-[10px] text-gray-400">
                  {name.length}/{MAX_NAME}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  {t("wishes.message_label")}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                  placeholder={t("wishes.message_placeholder")}
                  className="min-h-[100px] resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  maxLength={MAX_MESSAGE}
                  required
                  disabled={submitting}
                />
                <span className="self-end text-[10px] text-gray-400">
                  {message.length}/{MAX_MESSAGE}
                </span>
              </div>

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !name.trim() || !message.trim()}
                className="rounded-full py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{ backgroundColor: colorAccent, color: backgroundColor }}
              >
                {submitting ? "..." : t("wishes.submit")}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
