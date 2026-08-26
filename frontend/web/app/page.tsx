import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { BrandStatement, FAQ, FeaturedProducts, FinalCTA, HowItWorks, ServiceRail, Testimonials, Trust } from "@/components/sections";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ServiceRail />
        <FeaturedProducts />
        <BrandStatement />
        <HowItWorks />
        <Trust />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
