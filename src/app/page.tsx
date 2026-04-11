import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Reservation from "@/components/Reservation";
import Location from "@/components/Location";
import FAQ from "@/components/FAQ";
import { faqSchema } from "@/lib/faqSchema";
import Footer from "@/components/Footer";
import ScrollSnapHandler from "@/components/ScrollSnapHandler";
import ColorBlend from "@/components/ColorBlend";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://sweettalks.in" },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ScrollSnapHandler />
      <ColorBlend />
      <Navbar />
      <main>
        <Hero />
        <Story />
        <Menu />
        <Gallery />
        <Testimonials />
        <Reservation />
        <Location />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
