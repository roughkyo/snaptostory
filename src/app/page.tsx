import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Generator from "@/components/sections/Generator";
import Gallery from "@/components/sections/Gallery";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-purple-100 selection:text-primary relative overflow-hidden">
      {/* Background Blobs for Glassmorphism Effect - 배경이 회색일 때 대비가 더 잘됨 */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/50 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-pink-100/30 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute top-[40%] left-[60%] w-[35%] h-[35%] bg-indigo-100/40 rounded-full blur-[110px]"></div>
      </div>

      <Header />
      <Hero />
      <Generator />
      <Gallery />
      <Footer />
    </main>
  );
}
