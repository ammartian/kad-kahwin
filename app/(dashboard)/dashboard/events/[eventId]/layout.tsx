"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Gift, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { href: "builder", labelKey: "event_nav.builder", icon: LayoutDashboard },
  { href: "guests", labelKey: "event_nav.guests", icon: Users },
  { href: "wishlist", labelKey: "event_nav.wishlist", icon: Gift },
] as const;

export default function EventIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const eventId = params.eventId as Id<"events">;
  const { t } = useTranslation();
  const event = useQuery(api.events.getEvent, { eventId });
  const updateEvent = useMutation(api.events.updateEvent);

  const handlePublish = () => {
    updateEvent({ eventId, published: !event?.published });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <nav className="sticky top-0 z-10 flex shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 py-2 sm:px-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("dashboard.manage")}
          </Button>
        </Link>
        <div className="h-4 w-px bg-gray-200" />
        {event && (
          <>
            <Button
              variant={event.published ? "outline" : "default"}
              size="sm"
              onClick={handlePublish}
            >
              {event.published ? t("event_card.published") : t("event_card.draft")}
            </Button>
            {event.published && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/${event.slug}`} target="_blank" rel="noopener noreferrer" prefetch={false}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t("event_card.view_invitation")}
                </Link>
              </Button>
            )}
            <div className="h-4 w-px bg-gray-200" />
          </>
        )}
        {tabs.map(({ href, labelKey, icon: Icon }) => {
          const isActive = pathname.endsWith(`/${href}`);
          return (
            <Link
              key={href}
              href={`/dashboard/events/${eventId}/${href}`}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
