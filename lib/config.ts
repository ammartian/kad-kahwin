// Application configuration
export const APP_STATUS = (process.env.NEXT_PUBLIC_APP_STATUS || "waitlist") as
  | "waitlist"
  | "live";

export const isWaitlistMode = APP_STATUS === "waitlist";
export const isLiveMode = APP_STATUS === "live";

// CTA configuration based on app status
export const ctaConfig = {
  waitlist: {
    primary: {
      text: "Sertai Senarai Tunggu",
      textEn: "Join Waitlist",
    },
    secondary: {
      text: "Tonton Demo 1 Minit",
      textEn: "Watch 1 Min Demo",
    },
  },
  live: {
    primary: {
      text: "Cuba Percuma Sekarang",
      textEn: "Try Free Now",
    },
    secondary: {
      text: "Tonton Demo 1 Minit",
      textEn: "Watch 1 Min Demo",
    },
  },
};

// Site metadata
export const siteConfig = {
  name: "Kad Kahwin",
  description:
    "Modern digital wedding invitation platform for Malaysian couples",
  url: "https://kadkahwin.my",
  ogImage: "/og-image.png",
  links: {
    instagram: "https://instagram.com/kadkahwin",
    facebook: "https://facebook.com/kadkahwin",
    tiktok: "https://tiktok.com/@kadkahwin",
  },
  contact: {
    email: "hello@kadkahwin.my",
  },
  pricing: {
    amount: 39,
    currency: "MYR",
    earlyBirdFree: true,
    earlyBirdLimit: 50,
  },
};
