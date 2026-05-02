import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://adntrust.net",
  ),
  applicationName: "ADN CRM Suite",
  title: {
    default: "ADN CRM Suite",
    template: "%s | ADN CRM Suite",
  },
  description:
    "ADN Trust icin canliya hazir sigorta operasyon, acente yonetimi, police, lead ve ekip kontrol platformu.",
  manifest: "/manifest.webmanifest",
  keywords: [
    "ADN Trust",
    "sigorta crm",
    "acente yonetimi",
    "policy tracking",
    "lead management",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ADN CRM",
  },
  icons: {
    icon: "/adnlogo.png",
    apple: "/adnlogo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#10151d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="font-sans">{children}</body>
    </html>
  );
}
