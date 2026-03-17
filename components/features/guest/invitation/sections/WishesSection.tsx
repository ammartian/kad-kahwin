"use client";

import { useState, useMemo } from "react";
import { usePaginatedQuery, useQuery, useMutation } from "convex/react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Trash2, Send } from "lucide-react";

const WISHES_PAGE_SIZE = 50;

interface WishesSectionProps {
  eventId: Id<"events">;
  backgroundColor: string;
  colorPrimary: string;
  colorAccent: string;
}

export function WishesSection({
  eventId,
  backgroundColor,
  colorPrimary,
  colorAccent,
}: WishesSectionProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const getRelativeTime = useMemo(() => {
    return (timestamp: number): string => {
      const diff = Date.now() - timestamp;
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return t("wishes.just_now");
      if (minutes < 60) return t("wishes.minutes_ago", { count: minutes });
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return t("wishes.hours_ago", { count: hours });
      const days = Math.floor(hours / 24);
      return t("wishes.days_ago", { count: days });
    };
  }, [t]);

  const { results: wishes, status, loadMore } = usePaginatedQuery(
    api.wishes.listWishes,
    { eventId },
    { initialNumItems: WISHES_PAGE_SIZE }
  );
  const isManager = useQuery(api.guest.isManagerOfEvent, { eventId });
  const addWish = useMutation(api.wishes.addWish);
  const deleteWish = useMutation(api.wishes.deleteWish);

  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedName = guestName.trim();
    const trimmedMsg = message.trim();
    if (!trimmedName || !trimmedMsg) return;
    if (trimmedMsg.length > 255) {
      setError("Wish cannot exceed 255 characters");
      return;
    }
    try {
      await addWish({ eventId, guestName: trimmedName, message: trimmedMsg });
      setMessage("");
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post");
    }
  };

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="px-6 py-12"
      style={{ backgroundColor, color: colorPrimary }}
    >
      {/* Title */}
      <div className="mb-8 text-center">
        <div className="mb-2 text-xs tracking-[0.3em] uppercase" style={{ color: colorAccent }}>
          {t("wishes.title")}
        </div>
        <div className="mx-auto h-px w-16" style={{ backgroundColor: colorAccent }} />
      </div>

      {/* Wishes list */}
      <div className="mb-8 max-h-80 space-y-3 overflow-y-auto">
        <AnimatePresence initial={false}>
          {wishes?.map((w) => (
            <motion.div
              key={w._id}
              initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold" style={{ color: colorAccent }}>
                    {w.guestName}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{w.message}</p>
                  <p className="mt-1 text-xs opacity-50">
                    {getRelativeTime(w.createdAt)}
                  </p>
                </div>
                {isManager && (
                  <button
                    type="button"
                    onClick={() => deleteWish({ wishId: w._id })}
                    className="shrink-0 rounded-full p-1.5 text-red-400 transition-colors hover:bg-red-500/20"
                    aria-label="Delete wish"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {wishes?.length === 0 && status !== "LoadingFirstPage" && (
          <p className="py-4 text-center text-sm opacity-50">
            Jadilah yang pertama mengucapkan tahniah!
          </p>
        )}

        {status === "CanLoadMore" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => loadMore(WISHES_PAGE_SIZE)}
            className="w-full opacity-60"
          >
            {t("wishes.load_more")}
          </Button>
        )}
      </div>

      {/* Write wish form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder={t("rsvp.name_placeholder")}
          required
          className="w-full rounded-xl border border-white/20 bg-white/15 px-4 py-2.5 text-sm placeholder-current placeholder-opacity-50 backdrop-blur-sm focus:outline-none focus:ring-2"
          style={{ color: colorPrimary }}
        />
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("wishes.placeholder")}
            maxLength={255}
            required
            rows={3}
            className="w-full rounded-xl border border-white/20 bg-white/15 px-4 py-2.5 text-sm placeholder-current placeholder-opacity-50 backdrop-blur-sm focus:outline-none focus:ring-2"
            style={{ color: colorPrimary }}
          />
          <span className="absolute bottom-2.5 right-3 text-xs opacity-40">
            {t("wishes.char_count", { count: message.length })}
          </span>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <motion.div
          animate={sendSuccess && !shouldReduceMotion ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Button
            type="submit"
            className="w-full gap-2 font-semibold text-white"
            style={{ backgroundColor: colorAccent }}
            disabled={!guestName.trim() || !message.trim()}
          >
            <Send className="h-4 w-4" />
            {t("wishes.send")}
          </Button>
        </motion.div>
      </form>
    </motion.section>
  );
}
