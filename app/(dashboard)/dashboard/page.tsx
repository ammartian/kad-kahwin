"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { api } from "@/convex/_generated/api";
import type { ListEventItem } from "@/types/events";
import { authClient } from "@/lib/auth-client";
import { LanguageToggle } from "@/components/landing/LanguageToggle";
import { CreateEventModal, EventCard } from "@/components/features/events";

export default function DashboardPage() {
  return (
    <>
      <AuthLoading>
        <DashboardSkeleton />
      </AuthLoading>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
      <Authenticated>
        <DashboardContent />
      </Authenticated>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
    </div>
  );
}

function RedirectToSignIn() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/sign-in");
  }, [router]);
  return null;
}

function DashboardContent() {
  const { t } = useTranslation();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const user = useQuery(api.auth.getCurrentUser);
  const events = useQuery(api.events.listMyEvents);

  if (user === undefined) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("dashboard.welcome")}
            {user?.name ? `, ${user.name}` : ""}!
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            {user?.email ?? ""}
          </p>
          <EventsSection
            events={events}
            onCreateClick={() => setCreateModalOpen(true)}
          />
        </div>
      </main>
      <CreateEventModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => setCreateModalOpen(false)}
      />
    </div>
  );
}

function DashboardHeader() {
  const { t } = useTranslation();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/sign-in");
        },
      },
    });
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900 font-poppins">
        {t("dashboard.app_name")}
      </h1>
      <div className="flex items-center gap-4">
        <LanguageToggle />
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {t("dashboard.sign_out")}
        </button>
      </div>
    </header>
  );
}

function EventsSection({
  events,
  onCreateClick,
}: {
  events: ListEventItem[] | undefined;
  onCreateClick: () => void;
}) {
  const { t } = useTranslation();

  if (events === undefined) {
    return (
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-12 flex items-center justify-center min-h-[200px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-4xl">💌</div>
        <h3 className="text-lg font-semibold text-gray-700">
          {t("dashboard.no_events")}
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          {t("dashboard.create_first")}
        </p>
        <button
          onClick={onCreateClick}
          className="mt-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors min-h-[44px]"
        >
          {t("dashboard.create_event")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {events.length === 1
            ? t("dashboard.event_count", { count: events.length })
            : t("dashboard.event_count_plural", { count: events.length })}
        </p>
        <button
          onClick={onCreateClick}
          className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors min-h-[44px] w-full sm:w-auto"
        >
          {t("dashboard.create_event")}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}
