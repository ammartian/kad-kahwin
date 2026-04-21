import { ReactNode } from "react";
import { I18nProvider } from "@/components/providers/I18nProvider";

export default function GuestLayout({ children }: { children: ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}
