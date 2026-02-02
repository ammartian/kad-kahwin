import type { Metadata } from "next";
import { Poppins, Nunito_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kadkahwin.my"),
  title: "Kad Kahwin - Digital Wedding Invitations Malaysia | Create in 5 Minutes",
  description:
    "Modern digital wedding invitation platform for Malaysian couples. Create, share, and manage beautiful invitations with RSVP, wishlist, and real-time wishes. RM39 one-time.",
  keywords:
    "kad kahwin digital, jemputan kahwin online, digital wedding invitation Malaysia, kad jemputan perkahwinan, e-invitation",
  openGraph: {
    title: "Kad Kahwin - Wedding Invitations Your Guests Will Remember",
    description:
      "Create stunning digital wedding invitations in 5 minutes. RSVP management, wishlist, real-time wishes. RM39 one-time.",
    images: ["/og-image.png"],
    type: "website",
    url: "https://kadkahwin.my",
    siteName: "Kad Kahwin",
    locale: "ms_MY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kad Kahwin - Digital Wedding Invitations",
    description:
      "Modern wedding invitations for modern couples. Create in 5 minutes.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://kadkahwin.my",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Kad Kahwin",
              applicationCategory: "WebApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "39",
                priceCurrency: "MYR",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "100",
              },
              description:
                "Modern digital wedding invitation platform for Malaysian couples. Create, share, and manage beautiful invitations with RSVP, wishlist, and real-time wishes.",
            }),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${nunitoSans.variable} ${montserrat.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
