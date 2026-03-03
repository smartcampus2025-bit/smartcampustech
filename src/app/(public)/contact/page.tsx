import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact SmartCampusTech for final year web projects and small business websites."
});

export default function ContactPage() {
  return <ContactPageContent />;
}

