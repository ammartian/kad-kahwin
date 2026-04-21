"use client";

import { useRef, useEffect, useState } from "react";
import { usePaginatedQuery, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const WISHES_PAGE_SIZE = 50;

interface WishesSectionProps {
  eventId: Id<"events">;
  colorAccent: string;
}

export function WishesSection({ eventId, colorAccent }: WishesSectionProps) {
  const { t } = useTranslation();
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [wishes?.length]);

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
      await addWish({
        eventId,
        guestName: trimmedName,
        message: trimmedMsg,
      });
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post");
    }
  };

  return (
    <section className="border-t border-white/20 px-6 py-6">
      <h2
        className="mb-4 text-lg font-semibold"
        style={{ color: colorAccent }}
      >
        {t("wishes.title")}
      </h2>

      <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
        {wishes?.length === 0 && status !== "LoadingFirstPage" && (
          <p className="text-sm text-gray-500">No wishes yet. Be the first!</p>
        )}
        {wishes?.map((w) => (
          <div
            key={w._id}
            className="rounded-sm bg-white/20 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{w.guestName}</p>
                <p className="text-sm">{w.message}</p>
              </div>
              {isManager && (
                <button
                  type="button"
                  onClick={() => deleteWish({ wishId: w._id })}
                  className="shrink-0 rounded p-1 text-red-600 hover:bg-red-500/20"
                  aria-label="Delete wish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {status === "CanLoadMore" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => loadMore(WISHES_PAGE_SIZE)}
            className="w-full text-gray-500"
          >
            {t("wishes.load_more")}
          </Button>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder={t("rsvp.name_placeholder")}
          required
          className="rounded-sm border border-gray-300 bg-white/90 px-3 py-2 text-sm"
        />
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("wishes.placeholder")}
            maxLength={255}
            required
            rows={3}
            className="w-full rounded-sm border border-gray-300 bg-white/90 px-3 py-2 text-sm"
          />
          <span className="absolute bottom-2 right-2 text-xs text-gray-500">
            {t("wishes.char_count", { count: message.length })}
          </span>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button
          type="submit"
          style={{ backgroundColor: colorAccent }}
          className="text-white hover:opacity-90"
        >
          {t("wishes.send")}
        </Button>
      </form>
    </section>
  );
}
