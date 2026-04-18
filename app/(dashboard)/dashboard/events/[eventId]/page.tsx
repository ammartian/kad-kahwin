"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function EventIdPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  useEffect(() => {
    if (eventId) {
      router.replace(`/dashboard/events/${eventId}/builder`);
    }
  }, [eventId, router]);

  return <LoadingScreen />;
}
