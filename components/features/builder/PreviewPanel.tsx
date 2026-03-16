"use client";

import { InvitationPreview } from "./InvitationPreview";

export function PreviewPanel() {
  return (
    <div className="flex flex-1 items-start justify-center overflow-auto bg-gray-100 p-4 lg:sticky lg:top-0 lg:h-full">
      <InvitationPreview />
    </div>
  );
}
