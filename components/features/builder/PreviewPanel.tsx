"use client";

import type { Id } from "@/convex/_generated/dataModel";
import { InvitationPreview } from "./InvitationPreview";

interface PreviewPanelProps {
  eventId: Id<"events">;
  carouselImageUrls: string[];
}

export function PreviewPanel({ eventId, carouselImageUrls }: PreviewPanelProps) {
  return (
    <div className="flex flex-1 items-start justify-center overflow-auto bg-gray-100 p-4 lg:sticky lg:top-0 lg:h-full">
      <InvitationPreview
        eventId={eventId}
        carouselImageUrls={carouselImageUrls}
      />
    </div>
  );
}
