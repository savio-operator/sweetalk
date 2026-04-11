import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import { faqSchema } from "@/lib/faqSchema";
import Footer from "@/components/Footer";
import ColorBlend from "@/components/ColorBlend";

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ColorBlend />
      <Navbar />
      <main className="pt-20">
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
