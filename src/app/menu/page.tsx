import Link from "next/link";
import Menu from "@/components/Menu";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Full Menu — Sweetalks, Thrikkakara, Kochi",
  description:
    "Browse the complete Sweetalks menu — Signatures, Pastries, Brownies, Falooda, Juices, and Savoury. Handcrafted fresh daily at Pipeline Road, Thrikkakara, Kochi.",
  alternates: { canonical: "https://sweettalks.in/menu" },
  openGraph: {
    title: "Full Menu — Sweetalks Thrikkakara, Kochi",
    description: "Belgium brownies, pistachio kunafa, falooda, loaded fries and more. Kochi's best dessert cafe.",
    url: "https://sweettalks.in/menu",
    images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "Sweetalks Menu — Thrikkakara, Kochi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full Menu — Sweetalks Thrikkakara, Kochi",
    description: "Belgium brownies, pistachio kunafa, falooda, loaded fries and more.",
    images: ["/images/logo.png"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://sweettalks.in" },
    { "@type": "ListItem", position: 2, name: "Menu", item: "https://sweettalks.in/menu" },
  ],
};

export default function MenuPage() {
  return (
    <div className="bg-brand-teal-bg min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-[20px] border-b border-white/40">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-32 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-jost text-[0.65rem] tracking-[2px] uppercase text-brand-deep-red hover:text-brand-teal transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <span className="font-charlotte text-[1.4rem] text-brand-crimson">
            Sweetalks
          </span>

          <a
            href="https://www.zomato.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center font-jost text-[0.65rem] tracking-[2px] uppercase bg-brand-crimson text-white rounded-full hover:bg-brand-deep-red transition-colors duration-300"
            style={{ padding: "10px 28px" }}
          >
            Order on Zomato
          </a>
        </div>
      </div>

      {/* Full menu section */}
      <main>
        <Menu />
      </main>

      {/* Bottom strip */}
      <div className="bg-brand-dark py-6 text-center font-jost text-[0.55rem] tracking-[1px] text-white/20 uppercase">
        © 2026 Sweetalks Thrikkakara · All Rights Reserved
      </div>
    </div>
  );
}



