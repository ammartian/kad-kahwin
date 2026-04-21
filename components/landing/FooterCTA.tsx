"use client";

import { useTranslation } from "react-i18next";
import { useSectionTracking } from "@/hooks/use-section-tracking";

export function FooterCTA() {
  const { t } = useTranslation();
  const { sectionRef } = useSectionTracking("footer_cta");

  return (
    <footer
      ref={sectionRef}
      className="py-8 px-[6vw] flex items-center justify-between flex-wrap gap-3"
      style={{ background: "var(--foreground)" }}
    >
      {/* Logo */}
      <div
        className="font-display font-bold text-[1rem] text-white"
        style={{ letterSpacing: "-0.02em" }}
      >
        Jemputan Digital ✦
      </div>

      {/* Nav links */}
      <div className="flex gap-5 flex-wrap">
        <a
          href="#features"
          className="text-[0.82rem] transition-colors duration-200 hover:text-primary"
          style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
        >
          {t("footer.nav_features")}
        </a>
        <a
          href="#pricing"
          className="text-[0.82rem] transition-colors duration-200 hover:text-primary"
          style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
        >
          {t("footer.nav_pricing")}
        </a>
        <a
          href="#faq"
          className="text-[0.82rem] transition-colors duration-200 hover:text-primary"
          style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
        >
          {t("footer.nav_faq")}
        </a>
        <a
          href="mailto:hello@jemputandigital.my"
          className="text-[0.82rem] transition-colors duration-200 hover:text-primary"
          style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
        >
          {t("footer.nav_contact")}
        </a>
      </div>

      {/* Copyright */}
      <p className="text-[0.78rem]" style={{ color: "rgba(255,255,255,0.5)" }}>
        {t("footer.copyright")}
      </p>
    </footer>
  );
}
