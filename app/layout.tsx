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
  metadataBase: new URL("https://jemputandigital.my"),
  title: "Jemputan Digital - Digital Wedding Invitations Malaysia | Create in 5 Minutes",
  description:
    "Modern digital wedding invitation platform for Malaysian couples. Create, share, and manage beautiful invitations with RSVP, wishlist, and real-time wishes. RM39 one-time.",
  keywords:
    "kad kahwin digital, jemputan kahwin online, digital wedding invitation Malaysia, kad jemputan perkahwinan, e-invitation",
  openGraph: {
    title: "Jemputan Digital - Wedding Invitations Your Guests Will Remember",
    description:
      "Create stunning digital wedding invitations in 5 minutes. RSVP management, wishlist, real-time wishes. RM39 one-time.",
    images: ["/logo.jpeg"],
    type: "website",
    url: "https://jemputandigital.my",
    siteName: "Jemputan Digital",
    locale: "ms_MY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jemputan Digital - Digital Wedding Invitations",
    description:
      "Modern wedding invitations for modern couples. Create in 5 minutes.",
    images: ["/logo.jpeg"],
  },
  alternates: {
    canonical: "https://jemputandigital.my",
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
              name: "Jemputan Digital",
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
