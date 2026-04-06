import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  variable: "--font-primary",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://petopiacare.in'),
  title: {
    default: "PetopiaCare | Quality you can feel, comfort they can sense",
    template: "%s | PetopiaCare",
  },
  description: "Shop premium pet collars, harnesses, vet-approved nutrition, and dog training guides built seamlessly for Indian climates.",
  keywords: ["premium dog products", "buy dog accessories India", "PetopiaCare", "dog training guides", "vet-approved nutrition"],
  authors: [{ name: "PetopiaCare" }],
  creator: "PetopiaCare India",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://petopiacare.in",
    siteName: "PetopiaCare",
    title: "PetopiaCare | High-End Dog Essentials",
    description: "Premium dog goods crafted for quality and durability in India.",
    images: [
      {
        url: "/logos/og-image.png",
        width: 1200,
        height: 630,
        alt: "PetopiaCare Brand Identity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PetopiaCare | Quality you can feel",
    description: "Premium dog goods crafted for quality and durability in India.",
    images: ["/logos/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-secondary">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
