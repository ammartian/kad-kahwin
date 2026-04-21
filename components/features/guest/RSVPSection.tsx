"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RSVPSectionProps {
  eventId: Id<"events">;
  rsvpDeadline?: string;
  colorAccent: string;
  onSubmitted?: (name: string) => void;
}

export function RSVPSection({
  eventId,
  rsvpDeadline,
  colorAccent,
  onSubmitted,
}: RSVPSectionProps) {
  const { t } = useTranslation();
  const submitRSVP = useMutation(api.rsvps.submitRSVP);

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [paxCount, setPaxCount] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rsvpForName = useQuery(
    api.rsvps.getRSVP,
    name.trim() ? { eventId, guestName: name.trim() } : "skip"
  );

  const isDeadlinePassed = rsvpDeadline
    ? new Date(rsvpDeadline) < new Date()
    : false;
  const alreadySubmitted = rsvpForName !== undefined && rsvpForName !== null;
  const isDisabled = isDeadlinePassed || alreadySubmitted || submitted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return;
    if (attending === null) return;
    if (attending && (paxCount < 1 || paxCount > 10)) return;

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
    }
  };

  return (
    <section className="border-t border-white/20 px-6 py-6">
      <h2
        className="mb-4 text-lg font-semibold"
        style={{ color: colorAccent }}
      >
        {t("rsvp.title")}
      </h2>

      {isDeadlinePassed && (
        <p className="mb-4 text-sm text-amber-600">
          {t("rsvp.deadline_passed")}
        </p>
      )}

      {(alreadySubmitted || submitted) && (
        <p className="rounded-lg bg-green-500/20 p-4 text-sm text-green-800">
          {t("rsvp.submitted")}
        </p>
      )}

      {!isDisabled && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              {t("rsvp.name_placeholder")} *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmad"
              required
              className="bg-white/90"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="attending"
                checked={attending === true}
                onChange={() => setAttending(true)}
              />
              <span>{t("rsvp.attending")}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="attending"
                checked={attending === false}
                onChange={() => setAttending(false)}
              />
              <span>{t("rsvp.not_attending")}</span>
            </label>
          </div>
          {attending === true && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t("rsvp.pax_label")}
              </label>
              <Input
                type="number"
                min={1}
                max={10}
                value={paxCount}
                onChange={(e) =>
                  setPaxCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))
                }
                className="bg-white/90"
              />
            </div>
          )}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Button
            type="submit"
            disabled={!name.trim() || attending === null}
            style={{ backgroundColor: colorAccent }}
            className="text-white hover:opacity-90"
          >
            {t("rsvp.submit")}
          </Button>
        </form>
      )}
    </section>
  );
}
