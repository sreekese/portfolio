import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

import "./fonts.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: "Sreekese P S — Software Engineer",
  description:
    "Sreekese P S, Software Engineer in Thrissur, Kerala. Seven years of web development experience, React.js projects, JavaScript, TypeScript, PHP and FastAPI.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sreekese P S — Software Engineer Portfolio",
    description:
      "React.js projects, responsive interfaces, and reusable software components.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Sreekese P S — Software Engineer Portfolio",
  },
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
