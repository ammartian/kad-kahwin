"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";

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
  const user = useQuery(api.auth.getCurrentUser);

  if (user === undefined) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat datang
            {user?.name ? `, ${user.name}` : ""}!
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            {user?.email ?? ""}
          </p>
          <EventsEmptyState />
        </div>
      </main>
    </div>
  );
}

function DashboardHeader() {
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
        Jemputan Digital
      </h1>
      <button
        onClick={handleSignOut}
        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        Log Keluar
      </button>
    </header>
  );
}

function EventsEmptyState() {
  return (
    <div className="rounded-xl bg-gray-50 border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center gap-4 text-center">
      <div className="text-4xl">💌</div>
      <h3 className="text-lg font-semibold text-gray-700">
        Tiada acara lagi
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        Cipta acara perkahwinan pertama anda untuk mula membuat kad
        jemputan digital.
      </p>
      <button
        disabled
        className="mt-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white opacity-40 cursor-not-allowed"
      >
        + Cipta Acara Baru
      </button>
      <p className="text-xs text-gray-400">
        Ciri ini akan tersedia sebentar lagi
      </p>
    </div>
  );
}
