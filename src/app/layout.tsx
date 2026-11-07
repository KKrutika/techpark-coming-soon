import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { PageLoader } from "@/components/page-loader";
import "./globals.css";
import "./typography.css";
import "./theme.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "Corner CoWorks";
const location = process.env.NEXT_PUBLIC_PROJECT_LOCATION || "Bhopal, Madhya Pradesh";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const tagline = "Real estate as a solution, built for professionals. Subscribe, rather than lease.";
const description = `${projectName} is an upcoming mini tech park in ${location} offering flexible, subscription-based coworking and commercial office spaces for growing businesses, startups and professionals. Register your interest for early access.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${projectName} — Flexible Office Spaces & Mini Tech Park in ${location} | Coming Soon`,
    template: `%s | ${projectName}`,
  },
  description,
  keywords: [
    "coworking space Bhopal",
    "office space for rent Bhopal",
    "flexible office space Madhya Pradesh",
    "tech park Bhopal",
    "commercial workspace",
    "subscribe office space",
    "shared office Bhopal",
    "startup office space MP",
    "managed office space India",
    projectName,
  ],
  authors: [{ name: projectName }],
  creator: projectName,
  publisher: projectName,
  alternates: { canonical: "/" },
  icons: { icon: "/building.svg" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: projectName,
    title: `${projectName} — Flexible Office Spaces & Mini Tech Park in ${location}`,
    description: tagline,
    images: [
      {
        url: "/images/logo-color.png",
        width: 1200,
        height: 630,
        alt: `${projectName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${projectName} — Coming Soon in ${location}`,
    description: tagline,
    images: ["/images/logo-color.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "real estate",
};

export const viewport: Viewport = {
  themeColor: "#071b50",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: projectName,
  url: siteUrl,
  logo: `${siteUrl}/images/logo-color.png`,
  description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bhopal",
    addressRegion: "Madhya Pradesh",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "enquiries",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@example.com",
    telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <PageLoader>{children}</PageLoader>
      </body>
    </html>
  );
}
