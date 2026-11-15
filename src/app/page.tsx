import HeroBanner from "@/src/app/component/home/HeroBanner";
import ProductSection from "@/src/app/component/home/ProductSection";

export default function Home() {
  return (
    <main className="min-h-screenb bg-[#E3E9E2]">
      <HeroBanner />
      <ProductSection />
    </main>
  );
}