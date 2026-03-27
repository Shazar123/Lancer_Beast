import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LancerBeast — Stop wasting connects on Upwork",
  description:
    "LancerBeast analyzes every Upwork job in milliseconds, scam detection, client trust score, and your personal hire probability. Before you bid.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://lancerbeast.com"
  ),
  openGraph: {
    title: "LancerBeast — Stop wasting connects",
    description:
      "Know if a client is real, detect scams, and see your hire probability before you spend a single connect.",
    type: "website",
    url: "https://lancerbeast.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "LancerBeast — Stop wasting connects",
    description:
      "Know if a client is real, detect scams, and see your hire probability before you spend a single connect.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
