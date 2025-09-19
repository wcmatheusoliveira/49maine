import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Bebas_Neue,
  Mozilla_Headline,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ykm5ayk.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zillaSlabFont.variable} ${bebasNeueFont.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
