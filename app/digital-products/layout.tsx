import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Handbooks & Training Courses",
  description: "Instant download dog care checklists, premium training video courses, and homemade pet food recipe books.",
  openGraph: {
    title: "Digital Handbooks & Training Courses | PetopiaCare",
    description: "Instant download dog care checklists, premium training video courses, and homemade pet food recipe books.",
    url: "https://petopiacare.in/digital-products",
  }
};

export default function DigitalProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
