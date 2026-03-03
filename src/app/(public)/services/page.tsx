import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ServicesPageContent } from "@/components/pages/ServicesPageContent";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "SmartCampusTech offers production-grade final year web projects for students and high-conversion websites for small businesses."
});

export default function ServicesPage() {
  return <ServicesPageContent />;
}

