import type { Metadata } from "next";

const BRAND_NAME = "SmartCampusTech";
const BASE_TITLE = `${BRAND_NAME} | Premium Web Development for Students & Small Businesses`;
const BASE_DESCRIPTION =
  "SmartCampusTech builds premium final year web projects for students and conversion-focused websites for small businesses in India.";

export const baseMetadata: Metadata = {
  title: {
    default: BASE_TITLE,
    template: `%s | ${BRAND_NAME}`
  },
  description: BASE_DESCRIPTION,
  metadataBase:
    process.env.NEXT_PUBLIC_SITE_URL != null
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
  openGraph: {
    title: BASE_TITLE,
    description: BASE_DESCRIPTION,
    type: "website",
    siteName: BRAND_NAME,
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: BASE_TITLE,
    description: BASE_DESCRIPTION
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export const createPageMetadata = (overrides: Metadata = {}): Metadata => ({
  ...baseMetadata,
  ...overrides,
  title:
    typeof overrides.title === "string"
      ? {
          default: overrides.title,
          template: `%s | ${BRAND_NAME}`
        }
      : overrides.title ?? baseMetadata.title
});

