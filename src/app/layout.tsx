import type { Metadata } from "next";
import { Jost, Lora } from "next/font/google";
import "./globals.css";

const jost = Jost({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jost",
  display: "block",
});

const lora = Lora({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-lora",
  display: "block",
});

const BASE_URL = "https://sweettalks.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Sweetalks — Artisan Desserts in Thrikkakara, Kochi",
    template: "%s — Sweetalks",
  },
  description:
    "Sweetalks is Thrikkakara's bold retro-modern dessert cafe. Handcrafted brownies, pistachio kunafa, falooda, and artisan desserts. Visit us at Pipeline Road, Kalamassery, Kochi.",
  keywords: [
    "dessert cafe kochi",
    "sweetalks thrikkakara",
    "artisan brownies kakkanad",
    "pistachio kunafa kochi",
    "falooda kochi",
    "dessert cafe kalamassery",
    "sweet shop kakkanad",
    "belgium brownie kochi",
    "artisan desserts thrikkakara",
  ],
  authors: [{ name: "Sweetalks", url: BASE_URL }],
  creator: "Sweetalks",
  publisher: "Sweetalks",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Sweetalks — Everyone Deserves Best",
    description:
      "Artisan desserts handcrafted daily. Brownies, kunafa, falooda, and more. Thrikkakara, Kakkanad, Kochi, Kerala.",
    url: BASE_URL,
    siteName: "Sweetalks",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Sweetalks — Artisan Desserts, Thrikkakara, Kochi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sweetalks — Everyone Deserves Best",
    description:
      "Artisan desserts handcrafted daily. Thrikkakara, Kakkanad, Kochi, Kerala.",
    images: ["/images/logo.png"],
  },
};

// ── JSON-LD: LocalBusiness (Bakery) ──────────────────────────────────────────
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  "@id": `${BASE_URL}/#business`,
  name: "Sweetalks",
  alternateName: "Sweet Talks Cafe",
  description:
    "Sweetalks is Thrikkakara's bold retro-modern dessert cafe. Handcrafted brownies, pistachio kunafa, falooda, and artisan desserts.",
  url: BASE_URL,
  telephone: "+916235745985",
  email: "info@sweetalks.in",
  image: `${BASE_URL}/images/logo.png`,
  logo: `${BASE_URL}/images/logo.png`,
  priceRange: "₹₹",
  servesCuisine: ["Desserts", "Bakery", "Continental", "Indian Sweets"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "38/3416, Pipeline Road",
    addressLocality: "Kalamassery, Thrikkakara",
    addressRegion: "Kerala",
    postalCode: "682033",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.0159,
    longitude: 76.3419,
  },
  hasMap: "https://maps.google.com/?q=Sweetalks+Thrikkakara+Kochi",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "12:00",
      closes: "23:59",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "124",
  },
  sameAs: [
    "https://www.instagram.com/sweetalks_cafe/",
    "https://www.facebook.com/sweetalks",
    "https://maps.google.com/?q=Sweetalks+Thrikkakara+Kochi",
    "https://www.swiggy.com/city/kochi/sweetalks-edapally-rest1320373",
  ],
  foundingDate: "2021",
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 10.0159,
      longitude: 76.3419,
    },
    geoRadius: "15000",
  },
};

// ── JSON-LD: WebSite (enables SiteLinks in SERP) ────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Sweetalks",
  description: "Thrikkakara's bold retro-modern dessert cafe. Handcrafted brownies, pistachio kunafa, falooda, and artisan desserts.",
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/blog?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ── JSON-LD: Organization ─────────────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Sweetalks",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+916235745985",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Malayalam"],
  },
  sameAs: [
    "https://www.instagram.com/sweetalks_cafe/",
    "https://www.facebook.com/sweetalks",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${lora.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
