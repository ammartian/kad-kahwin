"use client";

import { I18nProvider } from "@/components/providers/I18nProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import {
  Navbar,
  Hero,
  SocialProof,
  ProblemSolution,
  Features,
  HowItWorks,
  WhyYou,
  Pricing,
  SecondaryCTA,
  FAQ,
  FooterCTA,
  WaitlistModal,
} from "@/components/landing";

export default function Home() {
  return (
    <PostHogProvider>
      <I18nProvider>
        <div className="min-h-screen bg-background">
          {/* Navigation */}
          <Navbar />

          {/* Main content */}
          <main>
            {/* Section 1: Hero */}
            <Hero />

            {/* Section 2: Social Proof */}
            <SocialProof />

            {/* Section 3: Problem → Solution → Emotional Hook */}
            <ProblemSolution />

            {/* Section 4: Features */}
            <Features />

            {/* Section 5: How It Works */}
            <HowItWorks />

            {/* Section 6: Why You (Value Reinforcement) */}
            <WhyYou />

            {/* Section 7: Pricing */}
            <Pricing />

            {/* Section 8: Secondary CTA */}
            <SecondaryCTA />

            {/* Section 9: FAQ */}
            <FAQ />

            {/* Section 10: Footer CTA */}
            <FooterCTA />
          </main>

          {/* Waitlist Modal */}
          <WaitlistModal />
        </div>
      </I18nProvider>
    </PostHogProvider>
  );
}
