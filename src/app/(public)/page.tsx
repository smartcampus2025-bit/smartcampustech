import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { HomePageContent } from "@/components/pages/HomePageContent";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Web Development for Students & Small Businesses",
  description:
    "SmartCampusTech builds premium final year web projects for students and conversion-focused websites for small businesses across India."
});

export default function HomePage() {
  return <HomePageContent />;
}

