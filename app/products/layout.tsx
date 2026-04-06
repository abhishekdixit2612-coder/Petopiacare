import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Premium Dog Accessories & Nutrition",
  description: "Browse PetopiaCare's curated collection of extreme durability harnesses, luxury collars, and vet-approved nutrition made for Indian environments.",
  openGraph: {
    title: "Shop Premium Dog Accessories | PetopiaCare",
    description: "Browse PetopiaCare's curated collection of extreme durability harnesses, luxury collars, and vet-approved nutrition.",
    url: "https://petopiacare.in/products",
  }
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
