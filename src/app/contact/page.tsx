import Navbar from "@/components/Navbar";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import ColorBlend from "@/components/ColorBlend";

export default function ContactPage() {
  return (
    <>
      <ColorBlend />
      <Navbar />
      <main className="pt-20">
        <Location />
      </main>
      <Footer />
    </>
  );
}
