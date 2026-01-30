import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Generator from "@/components/sections/Generator";
import Gallery from "@/components/sections/Gallery";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-purple-100 selection:text-primary relative overflow-hidden">
      {/* Background Blobs for Glassmorphism Effect */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-blue-100/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-pink-100/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-indigo-50/40 rounded-full blur-[100px]"></div>
      </div>

      <Header />
      <Hero />
      <Generator />
      <Gallery />
      <Footer />
    </main>
  );
}
