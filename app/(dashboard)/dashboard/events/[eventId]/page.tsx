"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EventIdPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  useEffect(() => {
    if (eventId) {
      router.replace(`/dashboard/events/${eventId}/builder`);
    }
  }, [eventId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
    </div>
  );
}
