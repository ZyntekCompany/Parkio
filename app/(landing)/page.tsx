import { CallToAction } from "@/components/sections/call-to-action";
import { FAQs } from "@/components/sections/faqs";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Princing } from "@/components/sections/princing";
import { ProductShowcase } from "@/components/sections/product-showcase";

export default function Home() {
  return (
    <div className="h-dvh overflow-y-auto bg-white  ">
      <Header />
      <Hero />
      <ProductShowcase />
      <Features />
      {/* <Princing /> */}
      <FAQs />
      <CallToAction />
      <Footer />
    </div>
  );
}
