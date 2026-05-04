import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd, organizationLD, websiteLD } from "@/lib/seo";

// ── Playfair Display — editorial serif for headings & product names
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// ── DM Sans — clean geometric sans for UI, body, navigation
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://petopiacare.in"),
  title: {
    default: "PetopiaCare | Quality you can feel, comfort they can sense",
    template: "%s | PetopiaCare",
  },
  description:
    "Shop premium dog collars, harnesses, leashes, and expert guides built for Indian dogs and the Indian climate.",
  keywords: [
    "premium dog products",
    "buy dog accessories India",
    "PetopiaCare",
    "dog harness India",
    "dog collar India",
    "dog training guides",
    "vet-approved dog nutrition",
  ],
  authors: [{ name: "PetopiaCare" }],
  creator: "PetopiaCare India",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://petopiacare.in",
    siteName: "PetopiaCare",
    title: "PetopiaCare | Premium Dog Gear for Indian Dogs",
    description:
      "Collars, harnesses, leashes and expert care guides — crafted for Indian climates and Indian dog parents.",
    images: [
      {
        url: "/logos/og-image.png",
        width: 1200,
        height: 630,
        alt: "PetopiaCare — Quality you can feel, comfort they can sense",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PetopiaCare | Quality you can feel",
    description: "Premium dog gear crafted for quality and durability in India.",
    images: ["/logos/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-secondary">
        <JsonLd data={[organizationLD(), websiteLD()]} />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
