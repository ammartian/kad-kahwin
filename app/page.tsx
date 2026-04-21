"use client";

import { I18nProvider } from "@/components/providers/I18nProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { ConvexClientProvider } from "@/components/providers/ConvexProvider";
import {
  Navbar,
  Hero,
  Features,
  HowItWorks,
  Pricing,
  // Testimonials,
  SecondaryCTA,
  FAQ,
  FooterCTA,
  WaitlistModal,
} from "@/components/landing";

export default function Home() {
  return (
    <ConvexClientProvider>
      <PostHogProvider>
        <I18nProvider>
          <div className="min-h-screen bg-background">
            {/* Navigation */}
            <Navbar />

            {/* Main content */}
            <main>
              {/* Section 1: Hero */}
              <Hero />

              {/* Section 2: Features */}
              <Features />

              {/* Section 4: How It Works */}
              <HowItWorks />

              {/* Section 5: Pricing */}
              <Pricing />

              {/* Section 6: Testimonials (hidden for now) */}
              {/* <Testimonials /> */}

              {/* Section 7: FAQ */}
              <FAQ />

              {/* Section 8: Secondary CTA */}
              <SecondaryCTA />
            </main>

            {/* Footer */}
            <FooterCTA />

            {/* Waitlist Modal */}
            <WaitlistModal />
          </div>
        </I18nProvider>
      </PostHogProvider>
    </ConvexClientProvider>
  );
}
