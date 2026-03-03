import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://smartcampustech.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/secure-admin", "/secure-admin-login", "/api/admin"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

