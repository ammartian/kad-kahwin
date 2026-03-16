import { ReactNode } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { I18nProvider } from "@/components/providers/I18nProvider";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16 lg:pt-20 px-4">
          {children}
        </div>
      </div>
    </I18nProvider>
  );
}
