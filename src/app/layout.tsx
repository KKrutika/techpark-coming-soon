import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./typography.css";
import "./theme.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "TECHPARK";

export const metadata: Metadata = {
  title: `${projectName} | Coming Soon`,
  description:
    "A new destination for innovation, business and growth is taking shape. Register your interest in the upcoming Tech Park.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: `${projectName} | Coming Soon`,
    description: "Building the future. Creating possibilities.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
