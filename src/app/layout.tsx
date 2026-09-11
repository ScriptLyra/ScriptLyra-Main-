import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import Intro from "@/components/Intro";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RingCursor from "@/components/RingCursor";
import MotionProvider from "@/components/MotionProvider";
import PageTransition from "@/components/PageTransition";
import { site } from "@/lib/site";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const title = `${site.wordmark} — Where Stories Find Their Voice`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.wordmark}` },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "publishing platform",
    "publish a book",
    "manuscript submission",
    "independent publisher",
    "books",
    "authors",
    "literary journal",
    "storytelling",
  ],
  authors: [{ name: site.wordmark, url: site.url }],
  creator: site.wordmark,
  publisher: site.wordmark,
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.wordmark,
    title,
    description: site.description,
    locale: "en_GB",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.wordmark} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

/** Organisation and site-search markup, so search engines read the house correctly. */
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.wordmark,
      url: site.url,
      description: site.description,
      logo: `${site.url}/brand/logo-lockup.png`,
      slogan: site.tagline,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.wordmark,
      url: site.url,
      description: site.description,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />

        <MotionProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>

          <Intro>
            <Navbar />
            <PageTransition />
            <main id="main">{children}</main>
            <Footer />
            <RingCursor />
          </Intro>
        </MotionProvider>
      </body>
    </html>
  );
}
