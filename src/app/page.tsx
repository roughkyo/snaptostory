import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Generator from "@/components/sections/Generator";
import Gallery from "@/components/sections/Gallery";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Header />
      <Hero />
      <Generator />
      <Gallery />
      <Footer />
    </main>
  );
}
