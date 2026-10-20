import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

import "./fonts.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: "Sreekese P S — React.js Developer",
  description:
    "Sreekese P S, frontend software engineer in Thrissur, Kerala. Seven years of web development experience, React.js projects, JavaScript and TypeScript.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sreekese P S — React.js Portfolio",
    description:
      "React.js projects, responsive interfaces, and reusable frontend components.",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary", title: "Sreekese P S — React.js Portfolio" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
