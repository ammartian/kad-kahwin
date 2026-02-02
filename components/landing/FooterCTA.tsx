"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLandingStore } from "@/stores/landing-store";
import { isWaitlistMode, siteConfig } from "@/lib/config";
import { fadeIn } from "@/lib/animations";
import { Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import { trackSocialIconClicked } from "@/lib/posthog-events";
import { useSectionTracking } from "@/hooks/use-section-tracking";

// TikTok icon component (not in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function FooterCTA() {
  const { t } = useTranslation();
  const { sectionRef, isInView } = useSectionTracking("footer_cta");
  const { openWaitlistModal } = useLandingStore();

  const handleCTA = () => {
    if (isWaitlistMode) {
      openWaitlistModal("footer");
    } else {
      window.location.href = "/login";
    }
  };

  const handleSocialClick = (platform: string) => {
    trackSocialIconClicked(platform);
  };

  const footerLinks = [
    { label: t("footer.links.privacy"), href: "/privacy" },
    { label: t("footer.links.terms"), href: "/terms" },
    { label: t("footer.links.contact"), href: "/contact" },
    { label: t("footer.links.help"), href: "/help" },
  ];

  const socialLinks = [
    { icon: Instagram, href: siteConfig.links.instagram, label: "Instagram" },
    { icon: Facebook, href: siteConfig.links.facebook, label: "Facebook" },
    { icon: TikTokIcon, href: siteConfig.links.tiktok, label: "TikTok" },
  ];

  return (
    <footer ref={sectionRef} className="py-16 lg:py-20 bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Headline */}
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6">
            {t("footer.headline")}
          </h2>

          {/* CTA Button with float animation */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-10"
          >
            <Button
              size="lg"
              onClick={handleCTA}
              className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {t("footer.cta")}
            </Button>
          </motion.div>

          {/* Social icons */}
          {/* <div className="flex justify-center gap-4 mb-8">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                onClick={() => handleSocialClick(social.label.toLowerCase())}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div> */}

          {/* Footer links */}
          {/* <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav> */}

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
