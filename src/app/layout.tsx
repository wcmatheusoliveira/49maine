import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Bebas_Neue,
  Mozilla_Headline,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zillaSlabFont = Mozilla_Headline({
  weight: ["400", "700"],
  variable: "--font-zilla-slab",
  subsets: ["latin"],
});

const bebasNeueFont = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "49Maine | Rooted in Lincoln, inspired by Maine",
  description:
    "Quality meats, fresh seafood, handmade pastas, and wood-fired pizzas — all crafted to let the ingredients shine.",
};

async function getGAId() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/settings`, {
      cache: 'no-store' // Always fetch fresh settings
    });
    if (response.ok) {
      const data = await response.json();
      return data.gaMeasurementId;
    }
  } catch (error) {
    console.error('Failed to fetch GA ID:', error);
  }
  // Fallback to environment variable
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = await getGAId();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/ykm5ayk.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zillaSlabFont.variable} ${bebasNeueFont.variable} antialiased`}
      >
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
