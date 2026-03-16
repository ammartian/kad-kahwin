"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { ListEventItem } from "@/types/events";
import { siteConfig } from "@/lib/config";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";

interface EventCardProps {
  event: ListEventItem;
}

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export function EventCard({ event }: EventCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${siteConfig.url}/${event.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement("input");
      input.value = inviteUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <CardTitle className="text-base font-semibold line-clamp-2">
          {event.coupleName}
        </CardTitle>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            event.published
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {event.published ? t("event_card.published") : t("event_card.draft")}
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {formatDate(event.weddingDate)}
          {event.weddingTime ? ` • ${event.weddingTime}` : ""}
        </p>
        <p className="text-xs text-muted-foreground truncate" title={inviteUrl}>
          {siteConfig.url}/{event.slug}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          className="min-h-[44px] sm:min-h-9 flex-1"
          onClick={handleCopy}
        >
          <Copy className="size-4 mr-2" />
          {copied ? t("event_card.copied") : t("dashboard.copy_link")}
        </Button>
        <Button asChild size="sm" className="min-h-[44px] sm:min-h-9 flex-1">
          <Link href={`/dashboard/events/${event._id}`} prefetch={false}>
            <ExternalLink className="size-4 mr-2" />
            {t("dashboard.manage")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
