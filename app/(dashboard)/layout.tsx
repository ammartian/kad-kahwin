import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import { I18nProvider } from "@/components/providers/I18nProvider";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/sign-in");
  }

  return <I18nProvider>{children}</I18nProvider>;
}
