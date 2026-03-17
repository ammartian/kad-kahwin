"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { motion, useReducedMotion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

interface RSVPModalProps {
  eventId: Id<"events">;
  rsvpDeadline?: string;
  colorAccent: string;
  initialGuestName?: string | null;
  onSubmitted?: (name: string) => void;
}

export function RSVPModal({
  eventId,
  rsvpDeadline,
  colorAccent,
  initialGuestName,
  onSubmitted,
}: RSVPModalProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const submitRSVP = useMutation(api.rsvps.submitRSVP);

  const [name, setName] = useState(initialGuestName ?? "");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [paxCount, setPaxCount] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rsvpForName = useQuery(
    api.rsvps.getRSVP,
    name.trim() ? { eventId, guestName: name.trim() } : "skip"
  );

  const isDeadlinePassed = rsvpDeadline ? new Date(rsvpDeadline) < new Date() : false;
  const alreadySubmitted = rsvpForName !== undefined && rsvpForName !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || attending === null) return;
    if (attending && (paxCount < 1 || paxCount > 10)) return;
    setIsSubmitting(true);
    try {
      await submitRSVP({
        eventId,
        guestName: name.trim(),
        attending,
        paxCount: attending ? paxCount : 0,
      });
      setSubmitted(true);
      onSubmitted?.(name.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted || alreadySubmitted) {
    const rsvp = rsvpForName ?? { attending: true, paxCount };
    return (
      <div className="px-6 pb-8 pt-4">
        <motion.div
          initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center gap-4 py-6 text-center"
        >
          <CheckCircle className="h-16 w-16" style={{ color: colorAccent }} />
          <p className="text-lg font-semibold">{t("rsvp.already_submitted")}</p>
          <p className="text-sm text-gray-500">
            {t("rsvp.already_submitted_detail", {
              status: rsvp.attending ? t("rsvp.attending") : t("rsvp.not_attending"),
              pax: rsvp.paxCount,
            })}
          </p>
          {rsvpDeadline && (
            <p className="text-xs text-gray-400">
              {t("rsvp.deadline_passed")}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 pt-4">
      <h2 className="mb-6 text-center text-lg font-semibold">{t("rsvp.title")}</h2>

      {isDeadlinePassed && (
        <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {t("rsvp.deadline_passed")}
        </div>
      )}

      {!isDeadlinePassed && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              {t("rsvp.name_placeholder")} *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmad bin Abdullah"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Attending options */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: true, label: t("rsvp.attending") },
              { value: false, label: t("rsvp.not_attending") },
            ].map(({ value, label }) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => setAttending(value)}
                className="rounded-xl border-2 py-3 text-sm font-medium transition-all"
                style={{
                  borderColor: attending === value ? colorAccent : "#e5e7eb",
                  backgroundColor: attending === value ? `${colorAccent}15` : "transparent",
                  color: attending === value ? colorAccent : "#374151",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Pax count */}
          {attending === true && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">{t("rsvp.pax_label")}</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPaxCount(Math.max(1, paxCount - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border text-lg font-bold"
                  style={{ borderColor: colorAccent, color: colorAccent }}
                >
                  −
                </button>
                <span className="w-8 text-center text-xl font-bold">{paxCount}</span>
                <button
                  type="button"
                  onClick={() => setPaxCount(Math.min(10, paxCount + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border text-lg font-bold"
                  style={{ borderColor: colorAccent, color: colorAccent }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={!name.trim() || attending === null || isSubmitting}
            className="w-full font-semibold text-white"
            style={{ backgroundColor: colorAccent }}
          >
            {isSubmitting ? t("rsvp.submitting") : t("rsvp.submit")}
          </Button>
        </form>
      )}
    </div>
  );
}
