import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dog Care & Training Blog",
  description: "Expert advice, puppy training guides, behavioral insights, and holistic nutrition tips curated exclusively for PetopiaCare community.",
  openGraph: {
    title: "Dog Care & Training Blog | PetopiaCare",
    description: "Expert advice, puppy training guides, behavioral insights, and holistic nutrition tips.",
    url: "https://petopiacare.in/blog",
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
