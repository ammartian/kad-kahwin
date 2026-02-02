/**
 * PostHog Event Tracking Functions
 * All tracking events as specified in the PRD Section 5.5
 */

import { posthog, getDeviceType, getReferrer } from "./posthog";

// Event property types
export interface LandingPageViewedProps {
  referrer: string;
  device_type: string;
}

export interface HeroCTAClickedProps {
  button_text: string;
  section: "hero";
  button_type: "primary" | "secondary";
}

export interface DemoVideoPlayedProps {
  section: "how_it_works";
}

export interface DemoVideoCompletedProps {
  duration_watched: number;
  section: "how_it_works";
}

export interface SectionViewedProps {
  section_name: string;
  scroll_depth: number;
}

export interface WaitlistFormOpenedProps {
  trigger: "hero" | "secondary_cta" | "footer";
}

export interface WaitlistSubmittedProps {
  email_domain: string;
  trigger: "hero" | "secondary_cta" | "footer";
}

export interface FAQOpenedProps {
  question_number: number;
  question_text: string;
}

export interface PricingCTAClickedProps {
  plan: "one_time";
  section: "pricing";
}

export interface SocialIconClickedProps {
  platform: string;
  section: "footer";
}

export interface ScrollDepthProps {
  depth: "25%" | "50%" | "75%" | "100%";
}

// Tracking functions
export const trackLandingPageViewed = () => {
  posthog.capture("landing_page_viewed", {
    referrer: getReferrer(),
    device_type: getDeviceType(),
  });
};

export const trackHeroCTAClicked = (props: HeroCTAClickedProps) => {
  posthog.capture("hero_cta_clicked", props);
};

export const trackDemoVideoPlayed = () => {
  posthog.capture("demo_video_played", {
    section: "how_it_works",
  });
};

export const trackDemoVideoCompleted = (duration: number) => {
  posthog.capture("demo_video_completed", {
    duration_watched: duration,
    section: "how_it_works",
  });
};

export const trackSectionViewed = (props: SectionViewedProps) => {
  posthog.capture("section_viewed", props);
};

export const trackWaitlistFormOpened = (
  trigger: "hero" | "secondary_cta" | "footer"
) => {
  posthog.capture("waitlist_form_opened", {
    trigger,
  });
};

export const trackWaitlistSubmitted = (props: WaitlistSubmittedProps) => {
  posthog.capture("waitlist_submitted", props);
};

export const trackFAQOpened = (props: FAQOpenedProps) => {
  posthog.capture("faq_opened", props);
};

export const trackPricingCTAClicked = () => {
  posthog.capture("pricing_cta_clicked", {
    plan: "one_time",
    section: "pricing",
  });
};

export const trackSocialIconClicked = (platform: string) => {
  posthog.capture("social_icon_clicked", {
    platform,
    section: "footer",
  });
};

export const trackScrollDepth = (depth: "25%" | "50%" | "75%" | "100%") => {
  posthog.capture("scroll_depth", {
    depth,
  });
};
