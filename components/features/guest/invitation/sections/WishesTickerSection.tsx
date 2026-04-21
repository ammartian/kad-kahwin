"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";

interface WishesTickerSectionProps {
  eventId: Id<"events">;
  backgroundColor: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  backgroundImageUrl?: string | null;
}

export function WishesTickerSection({
  eventId,
  backgroundColor,
  colorPrimary,
  colorSecondary,
  colorAccent,
  backgroundImageUrl,
}: WishesTickerSectionProps) {
  const { t } = useTranslation();
  const wishes = useQuery(api.wishes.getRecentWishes, { eventId });
  const [paused, setPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  const hasWishes = wishes && wishes.length > 0;
  const doubled = hasWishes ? [...wishes, ...wishes] : [];

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundColor }}
    >
      {backgroundImageUrl && (
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          className="object-cover opacity-20"
          priority={false}
        />
      )}

      <div className="relative z-10 w-full max-w-md">
        {/* Section title */}
        <h2
          className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.2em]"
          style={{ color: colorAccent }}
        >
          {t("wishes.title")}
        </h2>

        {!hasWishes ? (
          <p
            className="text-center text-sm"
            style={{ color: colorSecondary }}
          >
            {t("wishes.ticker_empty")}
          </p>
        ) : (
          <div
            className="relative h-[420px] overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
            <div
              ref={tickerRef}
              className="flex flex-col gap-4"
              style={{
                animation: `wishScroll ${Math.max(doubled.length * 3, 12)}s linear infinite`,
                animationPlayState: paused ? "paused" : "running",
              }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
            >
              {doubled.map((wish, i) => (
                <div
                  key={`${wish._id}-${i}`}
                  className="rounded-2xl px-5 py-4 shadow-sm"
                  style={{
                    backgroundColor: `${colorAccent}18`,
                    borderLeft: `3px solid ${colorAccent}`,
                  }}
                >
                  <p
                    className="mb-1 text-xs font-semibold"
                    style={{ color: colorAccent }}
                  >
                    {wish.guestName}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: colorPrimary }}
                  >
                    {wish.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes wishScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}
