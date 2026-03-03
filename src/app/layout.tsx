import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "@/styles/globals.css";
import { baseMetadata } from "@/lib/seo";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { FloatingWhatsAppButton } from "@/components/layout/FloatingWhatsAppButton";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
});

export const metadata: Metadata = baseMetadata;

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} min-h-screen bg-slate-950 text-slate-50 antialiased`}
      >
        <ThemeProvider>
          <GoogleAnalytics />
          {children}
          <FloatingWhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}


