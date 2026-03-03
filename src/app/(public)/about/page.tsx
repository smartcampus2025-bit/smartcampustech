import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { AboutPageContent } from "@/components/pages/AboutPageContent";

export const metadata: Metadata = createPageMetadata({
  title: "About SmartCampusTech",
  description:
    "SmartCampusTech is a focused web engineering studio delivering premium final year projects and small business websites."
});

export default function AboutPage() {
  return <AboutPageContent />;
}

